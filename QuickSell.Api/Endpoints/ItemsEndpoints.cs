using System;
using Microsoft.EntityFrameworkCore;
using QuickSell.Api.Data;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;

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
                i.Thumbnail
            )).ToArray();

            return Results.Ok(ItemDtos);

            // var ItemDtos = ItemEntities.Select(i => new ItemDto(
            //     i.ItemId,
            //     i.Name,
            //     i.ListedPrice,
            //     i.Category,
            //     i.Thumbnail
            // )).ToArray();

            // return ItemDtos is null ? Results.NotFound() : Results.Ok(ItemDtos);
            // //return Results.Ok(ItemDtos);
        });

        group.MapGet("/{id}", async (int id, QuickSellContext dbContext) =>
        {
            var item = await dbContext.Items.FindAsync(id);

            if (item is null)
            {
                return Results.NotFound();
            }

            var ItemDetailDto = new ItemDetailsDto(
                item.ItemId,
                item.Name,
                item.ListedPrice,
                item.Thumbnail,
                item.Description,
                item.UsedStatus
            );

            return Results.Ok(ItemDetailDto);
        }).WithName(GetItemsEndpointName);

        group.MapPost("/", async (CreateItemDto newItem, QuickSellContext dbContext) =>
        {
            var itemWithDetails = new Item
            {
                ItemId = newItem.ItemId,
                Name = newItem.Name,
                ListedPrice = newItem.ListedPrice,
                Category = newItem.Category,
                Thumbnail = newItem.Thumbnail,
                Description = newItem.Description,
                UsedStatus = newItem.UsedStatus
            };

            dbContext.Items.Add(itemWithDetails);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetItemsEndpointName, new { id = itemWithDetails.ItemId }, itemWithDetails);


        });

        return group;
    }
}
