using QuickSell.Api.Data;
using QuickSell.Api.Endpoints;
using QuickSell.Api.Entities;
using QuickSell.Api.Utils;

var builder = WebApplication.CreateBuilder(args);

// Db setup -- see 'appsettings.json'
var connString = builder.Configuration.GetConnectionString("QuickSell");
builder.Services.AddSqlServer<QuickSellContext>(connString);

var app = builder.Build();

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<QuickSellContext>();

// Temporary solution to remove and seed data to db to test dtos 
if (db.Items.Any())
{
    db.Items.RemoveRange(db.Items);
    db.SaveChanges();
}

var items = ReadJSON.ReadJson();
db.Items.AddRange(items);
db.SaveChanges();

app.UseStaticFiles();

app.MapItemsEndpoints();

app.Run();
