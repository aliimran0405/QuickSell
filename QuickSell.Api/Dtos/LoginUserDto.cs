using Microsoft.Identity.Client;

namespace QuickSell.Api.Dtos;

public record class LoginUserDto(
    string Email,
    string Password
);