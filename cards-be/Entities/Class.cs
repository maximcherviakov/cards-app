namespace API.Entites;

public class Class
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // navigation properties
    public int UserId { get; set; }
    public User User { get; set; }

    public List<Deck> Decks { get; set; } = [];
}
