using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using QuickSell.Api.Data;
using QuickSell.Api.Endpoints;
using QuickSell.Api.Entities;
using QuickSell.Api.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var jwtKey = builder.Configuration["Jwt:Key"] ?? "TestSecretKey12345678!!!MoreBytes";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
var issuer = builder.Configuration["Jwt:Issuer"] ?? "QuickSellAPI";

// Db setup - increase connection timeout
var connString = builder.Configuration.GetConnectionString("QuickSell");
if (!connString.Contains("Connection Timeout", StringComparison.OrdinalIgnoreCase))
{
    connString += connString.EndsWith(";") ? "" : ";";
    connString += "Connection Timeout=60;"; // increase timeout to 60s
}
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


// ---- CORS DEBUG LOGGER ----
app.Use(async (context, next) =>
{
    Console.WriteLine("---- CORS DEBUG ----");
    Console.WriteLine($"Method: {context.Request.Method}");
    Console.WriteLine($"Path: {context.Request.Path}");
    Console.WriteLine($"Origin: {context.Request.Headers["Origin"]}");
    Console.WriteLine($"Access-Control-Request-Method: {context.Request.Headers["Access-Control-Request-Method"]}");
    Console.WriteLine("--------------------");
    await next();
});

app.UseCors("AllowFrontEnd");
app.Use(async (context, next) =>
{
    if (context.Request.Method == HttpMethods.Options)
    {
        context.Response.StatusCode = StatusCodes.Status204NoContent;
        return;
    }
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapItemsEndpoints();
app.MapUsersEndpoints();
app.MapBidsEndpoints();

app.UseStaticFiles();

// ---- Move DB seeding to ApplicationStarted with retry logic ----
app.Lifetime.ApplicationStarted.Register(async () =>
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<QuickSellContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserProfile>>();

    var retries = 5;
    var delay = TimeSpan.FromSeconds(5);

    for (var attempt = 1; attempt <= retries; attempt++)
    {
        try
        {
            Console.WriteLine($"[DB INIT] Attempt {attempt} to connect and seed database...");
            await db.Database.EnsureCreatedAsync();

            if (app.Environment.IsDevelopment())
            {
                db.Items.RemoveRange(db.Items);
                db.Users.RemoveRange(db.Users);
                await db.SaveChangesAsync();


                var testUser = new UserProfile { UserName = "testuser1@gmail.com", Email = "testuser1@gmail.com", FirstName = "user1", LastName = "user1", CustomUsername = "testuser1" };
                await userManager.CreateAsync(testUser, "devuser123!");

                var testUser2 = new UserProfile { UserName = "testuser2@gmail.com", Email = "testuser2@gmail.com", FirstName = "user2", LastName = "user2", CustomUsername = "testuser2" };
                await userManager.CreateAsync(testUser2, "devuser123!");
            }
            else
            {
                if (!db.Items.Any())
                {
                    var items = ReadJSON.ReadJson();
                    db.Items.AddRange(items);
                    await db.SaveChangesAsync();
                }

                if (!db.Users.Any())
                {
                    var testUser = new UserProfile { UserName = "testuser1@gmail.com", Email = "testuser1@gmail.com", FirstName = "user1", LastName = "user1", CustomUsername = "testuser1" };
                    await userManager.CreateAsync(testUser, "devuser123!");

                    var testUser2 = new UserProfile { UserName = "testuser2@gmail.com", Email = "testuser2@gmail.com", FirstName = "user2", LastName = "user2", CustomUsername = "testuser2" };
                    await userManager.CreateAsync(testUser2, "devuser123!");
                }
            }

            Console.WriteLine("[DB INIT] Database seeding complete.");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DB INIT] Attempt {attempt} failed: {ex.Message}");
            if (attempt == retries) throw;
            await Task.Delay(delay);
            delay = delay * 2; // exponential backoff
        }
    }
});

app.Run();
