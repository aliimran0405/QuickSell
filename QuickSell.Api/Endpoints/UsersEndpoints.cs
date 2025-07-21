using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;

namespace QuickSell.Api.Endpoints;

public static class UsersEndpoints
{
    public static void MapUsersEndpoints(this WebApplication app)
    {
        app.MapPost("/register-account", async (RegisterUser request, UserManager<UserProfile> userManager) =>
        {
            var user = new UserProfile
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            // CHECK SWAGGER ENDPOINTS TO CONFIRM WITH LOGIN
            Console.WriteLine($"--------FirstName--------: {user.FirstName}, LastName: {user.LastName}");

            var result = await userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                return Results.Ok(new { message = "Registration Successful" });
            }
            else
            {
                return Results.BadRequest(result.Errors);
            }
        });
    }
}
