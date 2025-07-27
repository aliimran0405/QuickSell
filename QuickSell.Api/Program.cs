using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using QuickSell.Api.Data;
using QuickSell.Api.Endpoints;
using QuickSell.Api.Entities;
using QuickSell.Api.Utils;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;



var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"] ?? "TestSecretKey12345678!!!MoreBytes";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
var issuer = builder.Configuration["Jwt:Issuer"] ?? "QuickSellAPI";

// Db setup -- see 'appsettings.json'
var connString = builder.Configuration.GetConnectionString("QuickSell");
builder.Services.AddSqlServer<QuickSellContext>(connString);

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.Zero
    };
});

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
.AddDefaultTokenProviders()
.AddSignInManager();



//builder.Services.AddIdentityApiEndpoints<UserProfile>();

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


//app.MapIdentityApi<UserProfile>();

app.UseCors("AllowFrontEnd");

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.MapItemsEndpoints();

app.MapUsersEndpoints();

app.Run();
