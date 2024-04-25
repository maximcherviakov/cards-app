namespace API.Entites;

public class Deck
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
    public int? ClassId { get; set; }
    public Class? Class { get; set; }

    public List<Card> Cards { get; set; } = [];
}
