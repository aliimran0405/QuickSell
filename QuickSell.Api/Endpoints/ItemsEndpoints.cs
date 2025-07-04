using System;
using QuickSell.Api.Data;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;

namespace QuickSell.Api.Endpoints;

public static class ItemsEndpoints
{
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

        return group;
    }
}
