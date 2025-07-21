using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuickSell.Api.Entities;

namespace QuickSell.Api.Data;



public class QuickSellContext : IdentityDbContext<UserProfile>
{
    public QuickSellContext(DbContextOptions<QuickSellContext> options) : base(options) { }

    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        
        builder.Entity<UserProfile>(entity =>
        {
            entity.Property(u => u.FirstName)
                  .HasMaxLength(100);

            entity.Property(u => u.LastName)
                  .HasMaxLength(100);
        });
    }

}