using System;
using Microsoft.EntityFrameworkCore;

namespace QuickSell.Api.Entities;

public class User
{
    public int UserId { get; set; }

    public required string Username { get; set; }

    public required string Email { get; set; }

    public required string Password { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    [Precision(2, 2)]
    public decimal Rating { get; set; }
}
