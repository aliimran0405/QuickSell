using System;
using System.Text.Json;
using QuickSell.Api.Entities;

namespace QuickSell.Api.Utils;

public static class ReadJSON
{
    public static List<Item> ReadJson()
    {
        var filePath = Path.Combine(AppContext.BaseDirectory, "Data/ItemData.json");
        var json = File.ReadAllText(filePath);

        var data = JsonSerializer.Deserialize<List<Item>>(json);

        return data!;
        
    }
}
