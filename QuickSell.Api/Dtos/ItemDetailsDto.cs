namespace QuickSell.Api.Dtos;

public record class ItemDetailsDto(
    int ItemId,
    string Name,
    int ListedPrice,
    string Thumbnail,
    IEnumerable<string> MainImages,
    string Description,
    string UsedStatus
);

