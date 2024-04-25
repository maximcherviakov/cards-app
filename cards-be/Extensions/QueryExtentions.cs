using API.Entites;

namespace API.Extensions;

public static class QueryExtentions
{
    public static IQueryable<Deck> Search(this IQueryable<Deck> query, string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm)) return query;

        var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

        return query.Where(d => d.Title.ToLower().Contains(lowerCaseSearchTerm));
    }

    public static IQueryable<Class> Search(this IQueryable<Class> query, string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm)) return query;

        var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

        return query.Where(d => d.Title.ToLower().Contains(lowerCaseSearchTerm));
    }
}