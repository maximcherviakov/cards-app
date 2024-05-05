using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class DecksController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;

    public DecksController(DataContext context, IMapper mapper, UserManager<User> userManager)
    {
        _context = context;
        _mapper = mapper;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<DeckDto>>> GetDecks([FromQuery] QueryParams queryParams)
    {
        var query = _context.Decks
            .Search(queryParams.SearchTerm)
            .Include(item => item.User)
            .Include(item => item.Cards)
            .OrderBy(item => item.Id)
            .Select(items => _mapper.Map<DeckDto>(items))
            .AsQueryable();

        var decks = await PagedList<DeckDto>.ToPagedList(query, queryParams.PageNumber, queryParams.PageSize);

        Response.AddPaginationHeader(decks.MetaData);

        return decks;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DeckWithCardsDto>> GetDeck(int id)
    {
        if (await _context.Decks.FindAsync(id) == null) return NotFound();

        var deck = await _context.Decks
            .Include(item => item.User)
            .Include(item => item.Cards)
            .FirstAsync(item => item.Id == id);

        if (deck == null) return NotFound();

        if (deck.IsPrivate && deck.User.UserName != User.Identity?.Name) return Unauthorized();

        return _mapper.Map<DeckWithCardsDto>(deck);
    }

    [HttpGet("by-class-id/{id}")]
    public async Task<ActionResult<List<DeckDto>>> GetDecksByClassId(int id)
    {
        return await _context.Decks
            .Include(item => item.User)
            .Include(item => item.Cards)
            .Where(item => item.ClassId == id)
            .Select(items => _mapper.Map<DeckDto>(items))
            .ToListAsync();
    }
}