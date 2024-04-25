using API.Entites;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<Deck> Decks { get; set; }
    public DbSet<Class> Classes { get; set; }
}