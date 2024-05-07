using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
        var username = User.Identity?.Name;
        var user = username != null ? await _userManager.FindByNameAsync(username) : null;
        var userId = user?.Id;
        var query = _context.Decks
            .Search(queryParams.SearchTerm)
            .Include(item => item.User)
            .Include(item => item.Cards)
            .Where(items => items.IsPrivate == false || items.UserId == userId)
            .OrderBy(item => item.Id)
            .Select(items => _mapper.Map<DeckDto>(items))
            .AsQueryable();

        var decks = await PagedList<DeckDto>.ToPagedList(query, queryParams.PageNumber, queryParams.PageSize);

        Response.AddPaginationHeader(decks.MetaData);

        return decks;
    }

    [HttpGet("{id}", Name = "GetDeck")]
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

    [Authorize]
    [HttpGet("current-user")]
    public async Task<ActionResult<List<DeckDto>>> GetDecksForCurrentUser()
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        if (user == null) return Unauthorized();

        // get decks for user
        var decks = await _context.Decks
            .Include(item => item.User)
            .Include(item => item.Cards)
            .Where(item => item.UserId == user.Id)
            .Select(items => _mapper.Map<DeckDto>(items))
            .ToListAsync();

        return decks;
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

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<DeckDto>> CreateDeck(DeckContentDto deckDto)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        if (user == null) return Unauthorized();

        // create deck
        var deck = new Deck
        {
            Title = deckDto.Title,
            Description = deckDto.Description,
            IsPrivate = deckDto.IsPrivate,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // add deck
        user.Decks.Add(deck);

        // save
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtRoute("GetDeck", new { id = deck.Id }, _mapper.Map<DeckDto>(deck));

        return BadRequest(new ProblemDetails { Title = "Problem with saving deck" });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<DeckDto>> UpdateDeck(int id, DeckContentDto deckDto)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get deck
        if (await _context.Decks.FindAsync(id) == null) return NotFound();

        var deck = await _context.Decks
            .Include(item => item.User)
            .FirstAsync(item => item.Id == id);
        if (deck == null) return NotFound();
        if (deck.User?.UserName != User.Identity?.Name) return Unauthorized();

        // update deck
        deck.Title = deckDto.Title;
        deck.Description = deckDto.Description;
        deck.IsPrivate = deckDto.IsPrivate;
        deck.UpdatedAt = DateTime.Now;

        // save
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return _mapper.Map<DeckDto>(deck);

        return BadRequest(new ProblemDetails { Title = "Problem with updating deck" });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDeck(int id)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get deck
        if (await _context.Decks.FindAsync(id) == null) return NotFound();

        var deck = await _context.Decks
            .Include(item => item.User)
            .FirstAsync(item => item.Id == id);
        if (deck == null) return NotFound();
        if (deck.User?.UserName != User.Identity?.Name) return Unauthorized();

        // remove deck
        _context.Decks.Remove(deck);

        // save
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok("Deck has been removed");

        return BadRequest(new ProblemDetails { Title = "Problem with removing deck" });
    }
}