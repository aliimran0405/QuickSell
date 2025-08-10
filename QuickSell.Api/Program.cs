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

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var jwtKey = builder.Configuration["Jwt:Key"] ?? "TestSecretKey12345678!!!MoreBytes";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
var issuer = builder.Configuration["Jwt:Issuer"] ?? "QuickSellAPI";

// Db setup
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
    options.Lockout.AllowedForNewUsers = false;
    options.Lockout.MaxFailedAccessAttempts = int.MaxValue;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.Zero;

    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedAccount = false;

    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<QuickSellContext>()
.AddDefaultTokenProviders()
.AddSignInManager();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.LoginPath = "/login";
    options.SlidingExpiration = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontEnd", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://quicksell-wrpw.onrender.com")
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

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<QuickSellContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserProfile>>();

    if (app.Environment.IsDevelopment())
    {
        // Always clear & reseed in dev
        db.Items.RemoveRange(db.Items);
        db.Users.RemoveRange(db.Users);
        db.SaveChanges();

        var items = ReadJSON.ReadJson();
        db.Items.AddRange(items);
        db.SaveChanges();

        var testUser = new UserProfile { UserName = "aliimran0405@gmail.com", Email = "aliimran0405@gmail.com", FirstName = "Ali", LastName = "Imran", CustomUsername = "aliimran2002" };
        await userManager.CreateAsync(testUser, "alii2002");

        var testUser2 = new UserProfile { UserName = "rambo@gmail.com", Email = "rambo@gmail.com", FirstName = "Rambo", LastName = "Shenk", CustomUsername = "RamboShenk" };
        await userManager.CreateAsync(testUser2, "alii2002");
    }
    else
    {
        // Seed only if empty in prod
        if (!db.Items.Any())
        {
            var items = ReadJSON.ReadJson();
            db.Items.AddRange(items);
            db.SaveChanges();
        }

        if (!db.Users.Any())
        {
            var testUser = new UserProfile { UserName = "aliimran0405@gmail.com", Email = "aliimran0405@gmail.com", FirstName = "Ali", LastName = "Imran", CustomUsername = "aliimran2002" };
            await userManager.CreateAsync(testUser, "alii2002");

            var testUser2 = new UserProfile { UserName = "rambo@gmail.com", Email = "rambo@gmail.com", FirstName = "Rambo", LastName = "Shenk", CustomUsername = "RamboShenk" };
            await userManager.CreateAsync(testUser2, "alii2002");
        }
    }
}

app.UseCors("AllowFrontEnd");

app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

app.MapItemsEndpoints();
app.MapUsersEndpoints();
app.MapBidsEndpoints();

app.Run();
