using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser
{
    // navigation properties
    public List<Class> Classes { get; set; } = [];
    public List<Deck> Decks { get; set; } = [];
}