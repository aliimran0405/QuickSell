using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using QuickSell.Api.Dtos;
using QuickSell.Api.Entities;


namespace QuickSell.Api.Endpoints;

public static class UsersEndpoints
{

    public static void MapUsersEndpoints(this WebApplication app)
    {
        var AuthTagName = "Auth";

        app.MapPost("/register", async (RegisterUser request, UserManager<UserProfile> userManager) =>
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


        app.MapPost("/login", async (LoginUserDto login, UserManager<UserProfile> userManager) =>
        {
            var user = await userManager.FindByNameAsync(login.Email);
            if (user == null || !await userManager.CheckPasswordAsync(user, login.Password))
            {
                return Results.Unauthorized();
            }

            // Create JWT manually (using claims from user)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("CustomUsername", user.CustomUsername),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TestSecretKey12345678!!!MoreBytes"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "QuickSellAPI",
                audience: "QuickSell",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return Results.Ok(new { token = jwt });
        }).WithName(AuthTagName);




        app.MapPost("/logout", async (SignInManager<UserProfile> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return Results.Ok(new { message = "Logged out" });
        }).WithTags(AuthTagName);


        app.MapGet("/user", (HttpContext context) =>
        {
            var user = context.User;
            var response = new UserDto
            {
                UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Email = user.FindFirst(ClaimTypes.Email)?.Value,
                FirstName = user.FindFirst("FirstName")?.Value,
                LastName = user.FindFirst("LastName")?.Value,
                CustomUsername = user.FindFirst("CustomUsername")?.Value
            };



            return Results.Ok(response);
        }).RequireAuthorization();

        app.MapGet("/getUserId", (HttpContext context) =>
        {
            var user = context.User;
            var response = new UserIdDto
            {
                UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value!
            };

            return Results.Ok(response);
        }).RequireAuthorization();
        
    }
}
