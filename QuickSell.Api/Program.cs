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
builder.Services.AddIdentityApiEndpoints<UserProfile>().AddEntityFrameworkStores<QuickSellContext>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
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

app.UseCors();

app.UseStaticFiles();

app.MapItemsEndpoints();

app.MapUsersEndpoints();

app.Run();
