namespace QuickSell.Api.Dtos;

public record class ItemDetailsDto(
    int ItemId,
    string Name,
    int ListedPrice,
    string Thumbnail,
    string Description,
    string UsedStatus
);

