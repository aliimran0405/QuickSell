using System;
using Microsoft.EntityFrameworkCore;
using QuickSell.Api.Entities;

namespace QuickSell.Api.Data;

public class QuickSellContext(DbContextOptions<QuickSellContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Item> Items => Set<Item>();
}
