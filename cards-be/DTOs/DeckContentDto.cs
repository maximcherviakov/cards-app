namespace API.DTOs;

public class DeckContentDto
{
    public string Title { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
}