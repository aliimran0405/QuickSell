using System;
using Microsoft.EntityFrameworkCore;

namespace QuickSell.Api.Entities;

public class Item
{
    public int ItemId { get; set; }

    public required string Name { get; set; }

    public int ListedPrice { get; set; }

    public required string Category { get; set; }

    //Username of owner

    public required string Thumbnail { get; set; }
}
