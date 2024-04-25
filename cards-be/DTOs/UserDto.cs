namespace API.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string HashPassword { get; set; }
    public string Email { get; set; }
    public DateTime RegistrationTime { get; set; }
}