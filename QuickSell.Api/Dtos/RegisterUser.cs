namespace QuickSell.Api.Dtos;

// Handles the incoming new user data from the client. Unsure if Password should be as it currently is (read up on security later)
public class RegisterUser
{
    public required string UserName { get; set; } = default!;
    public required string Email { get; set; } = default!;
    public required string Password { get; set; } = default!;
    public required string FirstName { get; set; } = default!;
    public required string LastName { get; set; } = default!;

    public required string CustomUsername { get; set; } = default!;
}