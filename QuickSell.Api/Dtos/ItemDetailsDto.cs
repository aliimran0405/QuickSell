namespace QuickSell.Api.Dtos;

public record class OwnerDto(
    string OwnerUsername
);

public record class ItemDetailsDto(
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
    string OwnerId,
    OwnerDto Owner,
    string CreatedAt,
    string UpdatedAt
);

