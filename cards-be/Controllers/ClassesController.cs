using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ClassesController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public ClassesController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
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

    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDto>> GetClass(int id)
    {
        var studyClass = await _context.Classes.Include(item => item.User).FirstAsync(item => item.Id == id);

        if (studyClass == null) return NotFound();

        return _mapper.Map<ClassDto>(studyClass);
    }
}