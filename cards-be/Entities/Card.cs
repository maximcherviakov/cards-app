namespace API.Entities;

public class Card
{
    public int Id { get; set; }
    public string FrontText { get; set; }
    public string BackText { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // navigation properties
    public int DeckId { get; set; }
    public Deck Deck { get; set; }
}
