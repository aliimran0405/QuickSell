namespace QuickSell.Api.Dtos;

// Will handle incoming POST requests from client
public record class CreateItemDto
(
    int ItemId,
    string Name,
    int ListedPrice,
    string Category,
    string Thumbnail,
    IEnumerable<string> MainImages,
    string Description,
    string UsedStatus,
    string PostCode,
    string Area
);
