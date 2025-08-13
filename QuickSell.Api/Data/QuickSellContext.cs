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

    public DbSet<Bid> Bids => Set<Bid>();

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

        builder.Entity<Bid>()
            .HasOne(b => b.Item)
            .WithMany()
            .HasForeignKey(b => b.ItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Bid>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.Entity<Item>()
            .HasOne(i => i.Owner)
            .WithMany(u => u.ItemsOwned) // Assuming UserProfile has a collection of items
            .HasForeignKey(i => i.OwnerId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete if user is deleted


    }

}