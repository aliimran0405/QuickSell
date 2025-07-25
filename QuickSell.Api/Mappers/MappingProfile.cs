using System;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;

namespace QuickSell.Api.Mappers;

public static class MappingProfile
{
    public static void UpdateEntity(this Item item, UpdateItemDto dto)
    {
        item.Name = dto.Name;
        item.ListedPrice = dto.ListedPrice;
        item.Category = dto.Category;
        item.Thumbnail = dto.Thumbnail;
        item.MainImages = dto.MainImages?.ToList() ?? new List<string>();
        item.Description = dto.Description;
        item.UsedStatus = dto.UsedStatus;
        item.PostCode = dto.PostCode;
        item.Area = dto.Area;
    }

}
