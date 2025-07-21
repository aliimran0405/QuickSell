namespace QuickSell.Api.Dtos;

// Handles the incoming new user data from the client. Unsure if Password should be as it currently is (read up on security later)
public class RegisterUser
{
    public string UserName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
}