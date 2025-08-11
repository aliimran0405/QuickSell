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

    //public bool WinningBid { get; set; } = false;

    public int BidStatus { get; set; } = 0; // 2 = declined, 0 = pending, 1 = accepted
}
