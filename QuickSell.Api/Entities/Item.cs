using System;
using Microsoft.EntityFrameworkCore;

namespace QuickSell.Api.Entities;

public class Item
{
    public int ItemId { get; set; }

    public required string Name { get; set; }

    [Precision(8, 2)]
    public decimal ListedPrice { get; set; }

    //Username of owner

    public required string Thumbnail { get; set; }
}
