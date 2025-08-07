using System;

namespace QuickSell.Api.Entities;

public class Bid
{
    public int BidId { get; set; }

    public int ItemId { get; set; }
    public Item Item { get; set; } = null!;

    public string UserId { get; set; } = null!;
    public UserProfile User { get; set; } = null!;

    public int BidAmount { get; set; }

    public DateTime PostedAt { get; set; }
}
