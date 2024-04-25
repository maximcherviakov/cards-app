namespace API.DTOs;

public class CardDto
{
    public int Id { get; set; }
    public string FrontText { get; set; }
    public string BackText { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}