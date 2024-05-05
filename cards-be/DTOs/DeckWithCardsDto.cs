namespace API.DTOs;

public class DeckWithCardsDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int? ClassId { get; set; }
    public string Username { get; set; }
    public List<CardDto> Cards { get; set; }
}