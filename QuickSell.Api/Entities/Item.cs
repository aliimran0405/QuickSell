using System;
using Microsoft.EntityFrameworkCore;

namespace QuickSell.Api.Entities;

public class Item
{
    public int ItemId { get; set; }

    public required string Name { get; set; }

    public int ListedPrice { get; set; }

    public required string Category { get; set; }

    public required string Thumbnail { get; set; }

    public List<string> MainImages { get; set; } = new List<string>();

    public required string Description { get; set; }

    public required string UsedStatus { get; set; }

    public required string PostCode { get; set; }

    public required string Area { get; set; }

    public required string OwnerId { get; set; }

    public required DateTime CreatedAt { get; set; }

    public required DateTime UpdatedAt { get; set; }


    

}
