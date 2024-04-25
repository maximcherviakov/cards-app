namespace API.Entites;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string HashPassword { get; set; }
    public string Email { get; set; }
    public DateTime RegistrationTime { get; set; }

    // navigation properties
    public List<Class> Classes { get; set; } = [];
    public List<Deck> Decks { get; set; } = [];
}