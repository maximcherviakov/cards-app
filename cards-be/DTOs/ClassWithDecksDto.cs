namespace API.DTOs;

public class ClassWithDeckDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Username { get; set; }
    public List<DeckDto> Decks { get; set; }
}