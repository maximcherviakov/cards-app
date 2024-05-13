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

public class ClassesController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;

    public ClassesController(DataContext context, IMapper mapper, UserManager<User> userManager)
    {
        _context = context;
        _mapper = mapper;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<ClassDto>>> GetClasses([FromQuery] QueryParams queryParams)
    {
        var query = _context.Classes
            .Search(queryParams.SearchTerm)
            .Include(item => item.User)
            .Select(items => _mapper.Map<ClassDto>(items))
            .AsQueryable();

        var classes = await PagedList<ClassDto>.ToPagedList(query, queryParams.PageNumber, queryParams.PageSize);

        Response.AddPaginationHeader(classes.MetaData);

        return classes;
    }

    [HttpGet("{id}", Name = "GetClass")]
    public async Task<ActionResult<ClassWithDeckDto>> GetClass(int id)
    {
        if (await _context.Classes.FindAsync(id) == null) return NotFound();

        var studyClass = await _context.Classes
            .Include(item => item.User)
            .Include(item => item.Decks)
            .ThenInclude(item => item.Cards)
            .FirstAsync(item => item.Id == id);

        if (studyClass == null) return NotFound();

        if (studyClass.IsPrivate && studyClass.User.UserName != User.Identity?.Name) return Unauthorized();

        return _mapper.Map<ClassWithDeckDto>(studyClass);
    }

    [Authorize]
    [HttpGet("current-user")]
    public async Task<ActionResult<List<ClassDto>>> GetClassesForCurrentUser()
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        if (user == null) return Unauthorized();

        // get decks for user
        var studyClasses = await _context.Classes
            .Include(item => item.User)
            .Include(item => item.Decks)
            .Where(item => item.UserId == user.Id)
            .Select(items => _mapper.Map<ClassDto>(items))
            .ToListAsync();

        return studyClasses;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ClassDto>> CreateClass(ContentDto classDto)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        if (user == null) return Unauthorized();

        // create class
        var studyClass = new Class
        {
            Title = classDto.Title,
            Description = classDto.Description,
            IsPrivate = classDto.IsPrivate,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // add class
        user.Classes.Add(studyClass);

        // save
        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtRoute("GetClass", new { id = studyClass.Id }, _mapper.Map<ClassDto>(studyClass));

        return BadRequest(new ProblemDetails { Title = "Problem with saving class" });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ClassDto>> UpdateClass(int id, ContentDto classDto)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get class
        if (await _context.Classes.FindAsync(id) == null) return NotFound();

        var studyClass = await _context.Classes
            .Include(item => item.User)
            .FirstAsync(item => item.Id == id);
        if (studyClass == null) return NotFound();
        if (studyClass.User?.UserName != User.Identity?.Name) return Unauthorized();

        // update deck
        studyClass.Title = classDto.Title;
        studyClass.Description = classDto.Description;
        studyClass.IsPrivate = classDto.IsPrivate;
        studyClass.UpdatedAt = DateTime.Now;

        // save
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return _mapper.Map<ClassDto>(studyClass);

        return BadRequest(new ProblemDetails { Title = "Problem with updating class" });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteClass(int id)
    {
        // get user
        var user = await _userManager.FindByNameAsync(User.Identity?.Name);
        if (user == null) return Unauthorized();

        // get class
        if (await _context.Classes.FindAsync(id) == null) return NotFound();

        var studyClass = await _context.Classes
            .Include(item => item.User)
            .Include(item => item.Decks)
            .FirstAsync(item => item.Id == id);
        if (studyClass == null) return NotFound();
        if (studyClass.User?.UserName != User.Identity?.Name) return Unauthorized();

        // remove class
        studyClass.Decks.RemoveRange(0, studyClass.Decks.Count);
        _context.Classes.Remove(studyClass);

        // save
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return Ok("Class has been removed");

        return BadRequest(new ProblemDetails { Title = "Problem with removing class" });
    }
}