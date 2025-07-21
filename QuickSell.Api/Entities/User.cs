using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace QuickSell.Api.Entities;

public class UserProfile : IdentityUser
{
    
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

}
