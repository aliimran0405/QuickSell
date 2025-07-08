namespace QuickSell.Api.Dtos;

// Will handle incoming POST requests from client
public record class CreateItemDto
(
    int ItemId,
    string Name,
    int ListedPrice,
    string Category,
    string Thumbnail,
    string Description,
    string UsedStatus
);
