using API.Data;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class CardsController : BaseApiController
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public CardsController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [Authorize]
    [HttpPost("{id}")]
    public async Task<ActionResult> CreateCard(int id, CardContentDto cardDto)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get deck
        if (await _context.Decks.FindAsync(id) == null) return NotFound();

        var deck = await _context.Decks
            .Include(item => item.User)
            .Include(item => item.Cards)
            .FirstAsync(item => item.Id == id);

        if (deck == null) return NotFound();

        // check user
        if (deck.User.UserName != User.Identity?.Name) return Unauthorized();

        // create card
        var card = new Card
        {
            FrontText = cardDto.FrontText,
            BackText = cardDto.BackText,
            ImageUrl = cardDto.ImageUrl,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // add card
        deck.Cards.Add(card);

        // save
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem with saving card" });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCard(int id, CardContentDto cardDto)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get card
        if (await _context.Cards.FindAsync(id) == null) return NotFound();

        var card = await _context.Cards
            .Include(item => item.Deck)
            .Include(item => item.Deck.User)
            .FirstAsync(item => item.Id == id);

        if (card == null) return NotFound();

        // check user
        if (card.Deck.User.UserName != User.Identity?.Name) return Unauthorized();

        // update card
        card.FrontText = cardDto.FrontText;
        card.BackText = cardDto.BackText;
        card.ImageUrl = cardDto.ImageUrl;
        card.UpdatedAt = DateTime.Now;

        // save
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem with saving card" });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCard(int id)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get card
        if (await _context.Cards.FindAsync(id) == null) return NotFound();

        var card = await _context.Cards
            .Include(item => item.Deck)
            .Include(item => item.Deck.User)
            .FirstAsync(item => item.Id == id);

        if (card == null) return NotFound();
        var deck = card.Deck;

        // check user
        if (card.Deck.User.UserName != User.Identity?.Name) return Unauthorized();

        // delete card
        deck.Cards.Remove(card);

        // save
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem with deleting card" });
    }
}