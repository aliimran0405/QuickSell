namespace QuickSell.Api.Dtos;

public record class MyItemDetailsDto(
    int ItemId,
    string Name,
    int ListedPrice,
    string Thumbnail,
    string OwnerId,
    string UpdatedAt
);