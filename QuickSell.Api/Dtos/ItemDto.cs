namespace QuickSell.Api.Dtos;

public record class ItemDto(
    int ItemId,
    string Name,
    int ListedPrice,
    string Category,
    string Thumbnail,
    string PostCode,
    string Area
);

