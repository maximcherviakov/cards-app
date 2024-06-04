using API.Data;
using API.DTOs;
using API.Entities;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
        Card card = null;
        try
        {
            card = new Card
            {
                FrontText = cardDto.FrontText,
                BackText = cardDto.BackText,
                ImageUrl = await UploadHelper.UploadImage(cardDto.Image),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
        }
        catch (Exception ex)
        {
            return BadRequest(new ProblemDetails { Title = ex.Message });
        }

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
        var oldImageUrl = card.ImageUrl;
        try
        {
            if (!cardDto.FrontText.IsNullOrEmpty())
                card.FrontText = cardDto.FrontText;
            if (!cardDto.BackText.IsNullOrEmpty())
                card.BackText = cardDto.BackText;
            card.UpdatedAt = DateTime.Now;

            var newImageUrl = await UploadHelper.UploadImage(cardDto.Image);
            if (newImageUrl != null)
            {
                card.ImageUrl = newImageUrl;
                UploadHelper.DeleteFile(oldImageUrl);
            }

        }
        catch (Exception ex)
        {
            return BadRequest(new ProblemDetails { Title = ex.Message });
        }

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

    [HttpGet("image/{fileName}")]
    public ActionResult GetCardImage(string fileName)
    {
        if (!string.IsNullOrEmpty(fileName))
        {
            try
            {
                FileStream fileStream = UploadHelper.GetFileStream(fileName);
                return File(fileStream, "image/*");
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails { Title = ex.Message });
            }
        }

        return BadRequest(new ProblemDetails { Title = "Url is empty" });
    }
}