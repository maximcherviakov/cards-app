using API.Data;
using API.DTOs;
using API.Entites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class CardsController : BaseApiController
{
    private readonly DataContext _context;

    public CardsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CardDto>>> GetCards()
    {
        return MapCardsToDtos(await _context.Cards.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CardDto>> GetCard(int id)
    {
        var card = await _context.Cards.FindAsync(id);

        if (card == null) return NotFound();

        return MapCardToDto(card);
    }

    [HttpGet("by-deck-id/{id}")]
    public async Task<ActionResult<List<CardDto>>> GetCardsByDeckId(int id)
    {
        return MapCardsToDtos(await _context.Cards.Where(item => item.DeckId == id).ToListAsync());
    }

    private CardDto MapCardToDto(Card card)
    {
        return new CardDto
        {
            Id = card.Id,
            FrontText = card.FrontText,
            BackText = card.BackText,
            ImageUrl = card.ImageUrl,
            CreatedAt = card.CreatedAt,
            UpdatedAt = card.UpdatedAt,
        };
    }

    private List<CardDto> MapCardsToDtos(List<Card> cards)
    {
        List<CardDto> cardDtos = [];

        foreach (var card in cards)
        {
            cardDtos.Add(MapCardToDto(card));
        }

        return cardDtos;
    }
}