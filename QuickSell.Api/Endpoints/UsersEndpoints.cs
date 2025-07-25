using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.VisualBasic;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;


namespace QuickSell.Api.Endpoints;

public static class UsersEndpoints
{

    public static void MapUsersEndpoints(this WebApplication app)
    {
        var AuthTagName = "Auth";

        app.MapPost("/register-user", async (RegisterUser request, UserManager<UserProfile> userManager) =>
        {
            var user = new UserProfile
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                CustomUsername = request.CustomUsername
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
        }).WithTags(AuthTagName);


    app.MapPost("/login-user", async (
        LoginUserDto login,
        SignInManager<UserProfile> signInManager,
        UserManager<UserProfile> userManager,
        HttpContext httpContext) =>
        {
            var user = await userManager.FindByEmailAsync(login.Email);
            if (user == null)
            {
                return Results.Unauthorized();
            }

            var validPassword = await userManager.CheckPasswordAsync(user, login.Password);
            if (!validPassword)
            {
                return Results.Unauthorized();
            }

            // Create custom claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim("email", user.Email ?? ""),
                new Claim("customUsername", user.CustomUsername ?? "")
            };

            // Create identity and sign in
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

            return Results.Ok(new { message = "Logged in" });
        }).WithTags(AuthTagName);



        app.MapPost("/logout-user", async (SignInManager<UserProfile> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return Results.Ok(new { message = "Logged out" });
        }).WithTags(AuthTagName);


        app.MapGet("my-page", [Authorize] (ClaimsPrincipal user) =>
        {
            var name = user.Identity?.Name;
            var email = user.FindFirst("email")?.Value;
            var customUsername = user.FindFirst("customUsername")?.Value;
            
            return Results.Ok(new {
                name,
                email,
                customUsername
            });
        });
    }
}
