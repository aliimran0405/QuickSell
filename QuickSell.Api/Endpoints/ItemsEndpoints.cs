using System;
using Microsoft.EntityFrameworkCore;
using ImageMagick;
using QuickSell.Api.Data;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;
using QuickSell.Api.Mappers;
using System.Security.Claims;
using QuickSell.Api.Utils;
using Microsoft.AspNetCore.Builder;


namespace QuickSell.Api.Endpoints;

public static class ItemsEndpoints
{
    const string GetItemsEndpointName = "GetItem";
    public static RouteGroupBuilder MapItemsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/general-items");

        group.MapGet("/", (QuickSellContext dbContext, string? category) =>
        {
            // Allows me to query the entity 
            var itemsQuery = dbContext.Items.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                itemsQuery = itemsQuery.Where(i => i.Category == category); // Match the entity category with category string given as parameter
            }

            var items = itemsQuery.ToList();

            var ItemDtos = items.Select(i => new ItemDto(
                i.ItemId,
                i.Name,
                i.ListedPrice,
                i.Category,
                i.Thumbnail,
                i.PostCode,
                i.Area
            )).ToArray();

            return Results.Ok(ItemDtos);

        });

        group.MapGet("/{id}", async (int id, QuickSellContext dbContext) =>
        {
            var item = await dbContext.Items.Include(i => i.Owner).FirstOrDefaultAsync(i => i.ItemId == id);

            if (item is null)
            {
                return Results.NotFound();
            }

            var ItemDetailDto = new ItemDetailsDto(
                item.ItemId,
                item.Name,
                item.ListedPrice,
                item.Category,
                item.Thumbnail,
                item.MainImages,
                item.Description,
                item.UsedStatus,
                item.PostCode,
                item.Area,
                item.OwnerId,
                new OwnerDto(item.Owner.CustomUsername),
                item.CreatedAt.ToShortDateString(),
                item.UpdatedAt.ToShortDateString()
            );

            return Results.Ok(ItemDetailDto);
        }).WithName(GetItemsEndpointName);

        group.MapGet("/my-ads/{id}", async (int id, QuickSellContext dbContext, HttpContext context) =>
        {
            var item = await dbContext.Items.FindAsync(id);
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (item is null)
            {
                return Results.NotFound();
            }


            var MyItemDetailsDto = new MyItemDetailsDto(
                item.ItemId,
                item.Name,
                item.ListedPrice,
                item.Thumbnail,
                item.OwnerId,
                item.UpdatedAt.ToShortDateString()
            );

            return Results.Ok(MyItemDetailsDto);
        }).RequireAuthorization();

        group.MapPost("/new", async (HttpRequest request, QuickSellContext dbContext) =>
        {
            
            var form = await request.ReadFormAsync();

            var name = form["name"].ToString();
            var listedPrice = int.Parse(form["listedPrice"]);
            var category = form["category"].ToString();
            var description = form["description"].ToString();
            var usedStatus = form["usedStatus"].ToString();
            var postCode = form["postCode"].ToString();
            var area = form["area"].ToString();
            var ownerId = form["ownerId"].ToString();

            var files = form.Files;
            var imageUrls = new List<string>();
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/assets");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var uniqueFileName = Guid.NewGuid().ToString();
                string savedFileName;

                if (extension == ".heic")
                {
                    using var image = new MagickImage(file.OpenReadStream());
                    image.Format = MagickFormat.Jpeg;

                    savedFileName = uniqueFileName + ".jpg";
                    var jpegPath = Path.Combine(uploadsFolder, savedFileName);
                    await image.WriteAsync(jpegPath);
                }
                else
                {
                    savedFileName = uniqueFileName + extension;
                    var filePath = Path.Combine(uploadsFolder, savedFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                imageUrls.Add($"/assets/{savedFileName}");
            }

            // First image is the thumbnail
            var thumbnail = imageUrls.FirstOrDefault();

            // Rest are for ItemDetails only...thumbnail is the first image displayed in the carousel
            var mainImages = imageUrls.Skip(1).ToList();

            var itemWithDetails = new Item
            {
                Name = name,
                ListedPrice = listedPrice,
                Category = category,
                Thumbnail = thumbnail,
                MainImages = mainImages,
                Description = description,
                UsedStatus = usedStatus,
                PostCode = postCode,
                Area = area,
                OwnerId = ownerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            dbContext.Items.Add(itemWithDetails);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/general-items/{itemWithDetails.ItemId}", itemWithDetails);
        });


        group.MapPut("/edit/{id}", async (int id, HttpContext context, HttpRequest request, QuickSellContext dbContext) =>
        {
            // Find the item we are looking for
            var existingItem = dbContext.Items.Find(id);
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Console.WriteLine($"[Edit] UserId from JWT: {userId}");
            Console.WriteLine($"[Edit] OwnerId from DB: {existingItem.OwnerId}");

            // Return 404 is item does not exist
            if (existingItem is null)
            {
                return Results.NotFound();
            }

            if (existingItem.OwnerId.ToString() != userId?.ToString())
            {
                return Results.Forbid();
            }

            var form = await request.ReadFormAsync();

            var name = form["name"].ToString();
            var listedPrice = int.Parse(form["listedPrice"]);
            var category = form["category"].ToString();
            var description = form["description"].ToString();
            var usedStatus = form["usedStatus"].ToString();
            var postCode = form["postCode"].ToString();
            var area = form["area"].ToString();
            var ownerId = form["ownerId"].ToString();

            var files = form.Files;
            var imageUrls = new List<string>();
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/assets");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var uniqueFileName = Guid.NewGuid().ToString();
                string savedFileName;

                if (extension == ".heic")
                {
                    using var image = new MagickImage(file.OpenReadStream());
                    image.Format = MagickFormat.Jpeg;

                    savedFileName = uniqueFileName + ".jpg";
                    var jpegPath = Path.Combine(uploadsFolder, savedFileName);
                    await image.WriteAsync(jpegPath);
                }
                else
                {
                    savedFileName = uniqueFileName + extension;
                    var filePath = Path.Combine(uploadsFolder, savedFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                imageUrls.Add($"/assets/{savedFileName}");
            }

            var thumbnail = imageUrls.FirstOrDefault();
            var mainImages = imageUrls.Skip(1).ToList();

            existingItem.Name = name;
            existingItem.ListedPrice = listedPrice;
            existingItem.Category = category;
            existingItem.Thumbnail = thumbnail;
            existingItem.MainImages = mainImages;
            existingItem.Description = description;
            existingItem.UsedStatus = usedStatus;
            existingItem.PostCode = postCode;
            existingItem.Area = area;
            existingItem.OwnerId = ownerId;
            existingItem.UpdatedAt = DateTime.UtcNow;


            dbContext.SaveChanges();

            // Return 204
            return Results.NoContent();
        }).RequireAuthorization();

        group.MapDelete("/{id}", (int id, HttpContext context, QuickSellContext dbContext) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var item = dbContext.Items.Find(id);

            if (item.OwnerId.ToString() != userId.ToString())
            {
                return Results.Forbid();
            }

            dbContext.Items.Where(item => item.ItemId == id).ExecuteDelete();

            return Results.NoContent();
        }).RequireAuthorization();

        group.MapGet("/user-items", (HttpContext context, QuickSellContext dbContext) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var myItems = dbContext.Items
                .Where(item => item.OwnerId == userId)
                .Select(i => new ItemDto(
                    i.ItemId,
                    i.Name,
                    i.ListedPrice,
                    i.Category,
                    i.Thumbnail,
                    i.PostCode,
                    i.Area
                )).ToList();

            return Results.Ok(myItems);
        }).RequireAuthorization();


        group.MapGet("/get-area/{postCode}", (string postCode) =>
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "postcode-register.xlsx");
            Console.WriteLine("FILEPATH: " + filePath);
            string result = FindPostAreaClass.GetPostArea(filePath, postCode);

            

            return Results.Ok(result);
        }).RequireCors("AllowFrontEnd");



        return group;
    }
}
