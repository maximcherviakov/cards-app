using API.Data;
using API.DTOs;
using API.Entites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class UsersController : BaseApiController
{
    private readonly DataContext _context;

    public UsersController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        return MapUsersToDtos(await _context.Users.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null) return NotFound();

        return MapUserToDto(user);
    }

    private UserDto MapUserToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            HashPassword = user.HashPassword,
            Email = user.Email,
            RegistrationTime = user.RegistrationTime,
        };
    }

    private List<UserDto> MapUsersToDtos(List<User> users)
    {
        List<UserDto> userDtos = [];

        foreach (var user in users)
        {
            userDtos.Add(MapUserToDto(user));
        }

        return userDtos;
    }
}