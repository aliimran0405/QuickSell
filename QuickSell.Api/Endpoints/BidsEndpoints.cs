using System;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using QuickSell.Api.Data;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;


namespace QuickSell.Api.Endpoints;

public static class BidsEndpoints
{
    public static RouteGroupBuilder MapBidsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/bids");

        // Creates a new bid for the item
        group.MapPost("/place-bid", async (QuickSellContext dbContext, HttpContext context, PlaceBidDto request) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var item = await dbContext.Items.FindAsync(request.ItemId);
            if (item is null)
            {
                return Results.NotFound("Item not found");
            }

            // Make sure bid amount is larger than listed price
            if (request.BidAmount < item.ListedPrice)
            {
                return Results.BadRequest("Bid amount must be larger than the listed price");
            }

            // Check if the user has already placed a bid for this item
            var existingBid = await dbContext.Bids
                .FirstOrDefaultAsync(b => b.ItemId == request.ItemId && b.UserId == userId);

            if (existingBid != null)
            {
                return Results.Conflict("You have already placed a bid for this item.");
            }

            var bid = new Bid
            {
                ItemId = request.ItemId,
                UserId = userId,
                BidAmount = request.BidAmount,
                PostedAt = DateTime.UtcNow
            };

            dbContext.Bids.Add(bid);
            await dbContext.SaveChangesAsync();

            return Results.Ok(new { message = "Bid placed successfully", bid });
        }).RequireAuthorization();

        // Gets all bids for the respective item. Will be shown at /general-items/itemId for all users no matter logged in status
        group.MapGet("/item/{itemId}", async (QuickSellContext dbContext, int itemId) =>
        {
            var bids = await dbContext.Bids
                .Where(b => b.ItemId == itemId)
                .Include(b => b.User) // Load user info
                .OrderByDescending(b => b.BidAmount)
                .ToListAsync();

            return Results.Ok(bids);
        });

        // Gets all bids that have been posted for the item the owner of the item owns
        group.MapGet("/received-bids", async (QuickSellContext dbContext, HttpContext context) =>
        {
            var ownerId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId is null)
            {
                return Results.Unauthorized();
            }

            var receivedBids = await dbContext.Bids
                .Include(b => b.Item)
                .Include(b => b.User)
                .Where(b => b.Item.OwnerId == ownerId) // Owner’s items
                .OrderByDescending(b => b.BidAmount)
                .ToListAsync();

            return Results.Ok(receivedBids);
        }).RequireAuthorization();

        group.MapDelete("/delete/{bidId}", async (int bidId, QuickSellContext dbContext, HttpContext context) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var bidToDelete = await dbContext.Bids
                .FirstOrDefaultAsync(b => b.BidId == bidId);

            // If the repsective bid does not exist
            if (bidToDelete is null)
            {
                return Results.NotFound();
            }
            
            // Avoid mismatch
            if (bidToDelete.UserId != userId)
            {
                return Results.Forbid();
            }

            dbContext.Bids.Remove(bidToDelete);

            await dbContext.SaveChangesAsync();

            return Results.NoContent();


        }).RequireAuthorization();

        // Will be used to allow the user to view and modify bids they have posted to other items
        group.MapGet("/my-bids", async (QuickSellContext dbContext, HttpContext context) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var myBids = await (
                from b in dbContext.Bids
                where b.UserId == userId
                join i in dbContext.Items on b.ItemId equals i.ItemId
                join u in dbContext.Users on i.OwnerId equals u.Id
                orderby b.PostedAt descending
                select new
                {
                    Bid = b,
                    Item = i,
                    OwnerEmail = b.BidStatus == 1 ? new { u.Email } : null
                }).ToListAsync();

            Console.WriteLine($"========================: COUNT: {myBids.Count}");
            foreach (var b in myBids)
            {

                Console.WriteLine($"MYBIDS--------------: {b.Bid.BidAmount} {b.Bid.BidStatus}");
            }
            return Results.Ok(myBids);
        }).RequireAuthorization();

        group.MapPost("/change-status/{bidId}", async (int bidId, QuickSellContext dbContext, HttpContext context, ChangeBidStatusDto request) =>
        {
            var ownerId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (ownerId is null)
            {
                return Results.Unauthorized();
            }

            if (request.NewStatus != 1 && request.NewStatus != 2)
            {
                return Results.BadRequest();
            }

            var bid = await dbContext.Bids
                .Include(b => b.Item)
                .FirstOrDefaultAsync(b => b.BidId == bidId);

            if (bid is null)
            {
                return Results.NotFound();
            }

            if (bid.Item.OwnerId != ownerId)
            {
                return Results.Forbid();
            }

            if (request.NewStatus == 1)
            {
                bool alreadyAccepted = await dbContext.Bids
                    .AnyAsync(b => b.ItemId == b.ItemId && b.BidStatus == 1);

                if (alreadyAccepted)
                {
                    return Results.Conflict();
                }
            }

            bid.BidStatus = request.NewStatus;
            await dbContext.SaveChangesAsync();

            return Results.Ok(new { message = "Bid status updated successfully", bidId = bid.BidId, status = bid.BidStatus });
            
        }).RequireAuthorization();
        return group;
    }
}
