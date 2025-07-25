using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using QuickSell.Api.Data;
using QuickSell.Api.Endpoints;
using QuickSell.Api.Entities;
using QuickSell.Api.Utils;
using Swashbuckle.AspNetCore.Swagger;

var builder = WebApplication.CreateBuilder(args);

// Db setup -- see 'appsettings.json'
var connString = builder.Configuration.GetConnectionString("QuickSell");
builder.Services.AddSqlServer<QuickSellContext>(connString);

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
builder.Services.AddIdentityCore<UserProfile>(options =>
{
    // Disable account lockout
    options.Lockout.AllowedForNewUsers = false;
    options.Lockout.MaxFailedAccessAttempts = int.MaxValue;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.Zero;

    // Disable email confirmation
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedAccount = false;

    // Simplify password rules
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<QuickSellContext>()
.AddDefaultTokenProviders();



builder.Services.AddIdentityApiEndpoints<UserProfile>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.LoginPath = "/login"; // optional
    options.SlidingExpiration = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<QuickSellContext>();

// Temporary solution to remove and seed data to db to test dtos 
if (db.Items.Any())
{
    db.Items.RemoveRange(db.Items);
    db.SaveChanges();
}

if (db.Users.Any())
{
    db.Users.RemoveRange(db.Users);
    db.SaveChanges();
}

var items = ReadJSON.ReadJson();
db.Items.AddRange(items);
db.SaveChanges();

app.MapIdentityApi<UserProfile>();

app.UseCors("AllowFrontEnd");

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.MapItemsEndpoints();

app.MapUsersEndpoints();

app.Run();
