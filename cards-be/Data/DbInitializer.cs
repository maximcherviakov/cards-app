using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public static class DbInitializer
{
    public static async Task Initialize(DataContext context, UserManager<User> userManager)
    {
        var users = new List<User>
        {
            new User
            {
                UserName = "Jessica Thompson",
                Email = "jessica.thompson@example.com",
            },
            new User
            {
                UserName = "Alexander Lee",
                Email = "alexander.lee@example.com",
            },
            new User
            {
                UserName = "Samantha Rodriguez",
                Email = "samantha.rodriguez@example.com",
            },
            new User
            {
                UserName = "David Smith",
                Email = "david.smith@example.com",
            },
            new User
            {
                UserName = "Emily Chen",
                Email = "emily.chen@example.com",
            },
        };

        context.Cards.RemoveRange(context.Cards);
        context.Decks.RemoveRange(context.Decks);
        context.Classes.RemoveRange(context.Classes);
        context.Users.RemoveRange(context.Users);

        foreach (var user in users)
        {
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }

        var classes = new List<Class>
        {
            new Class
            {
                Id = 1,
                Title = "English class 1",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Class
            {
                Id = 2,
                Title = "English class 2",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Class
            {
                Id = 3,
                Title = "English class 3",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Class
            {
                Id = 4,
                Title = "English class 4",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Class
            {
                Id = 5,
                Title = "English class 5",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Class
            {
                Id = 6,
                Title = "English class 6",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Class
            {
                Id = 7,
                Title = "English class 7",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Class
            {
                Id = 8,
                Title = "English class 8",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Class
            {
                Id = 9,
                Title = "English class 9",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[2]
            },
            new Class
            {
                Id = 10,
                Title = "English class 10",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[2]
            },
            new Class
            {
                Id = 11,
                Title = "English class 11",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[3]
            },
            new Class
            {
                Id = 12,
                Title = "English class 12",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[3]
            },
            new Class
            {
                Id = 13,
                Title = "English class 13",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[4]
            },
            new Class
            {
                Id = 14,
                Title = "English class 14",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[4]
            },
            new Class
            {
                Id = 15,
                Title = "English class 15",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[4]
            },
            new Class
            {
                Id = 16,
                Title = "English class 16",
                Description = "Class for English",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[4]
            },
        };
        var decks = new List<Deck>
        {
            new Deck
            {
                Id = 1,
                Title = "Animals",
                Description = "Deck for animals topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Deck
            {
                Id = 2,
                Title = "Eating",
                Description = "Deck for eating topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Deck
            {
                Id = 3,
                Title = "Goods & Services",
                Description = "Deck for Goods & Services topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Deck
            {
                Id = 4,
                Title = "Home",
                Description = "Deck for Home topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Deck
            {
                Id = 5,
                Title = "Everyday Life",
                Description = "Deck for Everyday Life topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Deck
            {
                Id = 6,
                Title = "Family",
                Description = "Deck for Family topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[0]
            },
            new Deck
            {
                Id = 7,
                Title = "Emotions",
                Description = "Deck for Emotions topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Deck
            {
                Id = 8,
                Title = "Appearance",
                Description = "Deck for Appearance topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Deck
            {
                Id = 9,
                Title = "Health",
                Description = "Deck for Health topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[1]
            },
            new Deck
            {
                Id = 10,
                Title = "Science & Education",
                Description = "Deck for Science & Education topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[2]
            },
            new Deck
            {
                Id = 11,
                Title = "Weather & Nature",
                Description = "Deck for Weather & Nature topic",
                IsPrivate = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[2]
            },
            new Deck
            {
                Id = 12,
                Title = "Culture & Art",
                Description = "Deck for Culture & Art topic",
                IsPrivate = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = users[2]
            },
        };
        var cards = new List<Card>
        {
            new Card
            {
                Id = 1,
                FrontText = "Duck",
                BackText = "Качка",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            },
            new Card
            {
                Id = 2,
                FrontText = "Cow",
                BackText = "Корова",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            },
            new Card
            {
                Id = 3,
                FrontText = "Shop",
                BackText = "Магазин",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            },
            new Card
            {
                Id = 4,
                FrontText = "Cafe",
                BackText = "Кафе",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            },
        };

        users[0].Classes.Add(classes[0]);

        // classes.Find(item => item.Id == 1).User = users[0];

        classes.Find(item => item.Id == 1)?.Decks.Add(decks.Find(item => item.Id == 1));
        classes.Find(item => item.Id == 1)?.Decks.Add(decks.Find(item => item.Id == 2));
        classes.Find(item => item.Id == 1)?.Decks.Add(decks.Find(item => item.Id == 3));

        decks.Find(item => item.Title.Equals("Anumals"))?.Cards.Add(cards.Find(item => item.Id == 1));
        decks.Find(item => item.Title.Equals("Anumals"))?.Cards.Add(cards.Find(item => item.Id == 2));
        decks.Find(item => item.Title.Equals("Goods & Services"))?.Cards.Add(cards.Find(item => item.Id == 3));
        decks.Find(item => item.Title.Equals("Goods & Services"))?.Cards.Add(cards.Find(item => item.Id == 4));

        context.Classes.AddRange(classes);
        context.Decks.AddRange(decks);
        context.Decks.AddRange(decks);

        context.SaveChanges();
    }
}