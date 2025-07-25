using System;
using Microsoft.EntityFrameworkCore;
using ImageMagick;
using QuickSell.Api.Data;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;
using QuickSell.Api.Mappers;

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
                item.MainImages,
                item.Description,
                item.UsedStatus,
                item.PostCode,
                item.Area
            );

            return Results.Ok(ItemDetailDto);
        }).WithName(GetItemsEndpointName);

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
                Area = area
            };

            dbContext.Items.Add(itemWithDetails);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/general-items/{itemWithDetails.ItemId}", itemWithDetails);
        });


        group.MapPut("/edit{id}", (int id, UpdateItemDto updatedItem, QuickSellContext dbContext) =>
        {
            // Find the item we are looking for
            var existingItem = dbContext.Items.Find(id);

            // Return 404 is item does not exist
            if (existingItem is null)
            {
                return Results.NotFound();
            }

            existingItem.UpdateEntity(updatedItem);


            dbContext.SaveChanges();

            // Return 204
            return Results.NoContent();
        });


        return group;
    }
}
