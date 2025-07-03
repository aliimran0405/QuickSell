using QuickSell.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Db setup -- see 'appsettings.json'
var connString = builder.Configuration.GetConnectionString("QuickSell");
builder.Services.AddSqlServer<QuickSellContext>(connString);

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
