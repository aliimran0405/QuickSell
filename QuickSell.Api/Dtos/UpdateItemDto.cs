namespace QuickSell.Api.Dtos;

public record class UpdateItemDto(
    int ItemId,
    string Name,
    int ListedPrice,
    string Category,
    string Thumbnail,
    IEnumerable<string> MainImages,
    string Description,
    string UsedStatus,
    string PostCode,
    string Area,
    string UpdatedAt
);