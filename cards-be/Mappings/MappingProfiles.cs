using API.DTOs;
using API.Entites;
using AutoMapper;

namespace API.Mapping;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Deck, DeckDto>()
            .ForMember(dest => dest.CardsCount,
                    opt => opt.MapFrom(src => src.Cards.Count))
            .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User.Username));
        CreateMap<Deck, DeckWithCardsDto>()
            .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.Cards,
                    opt => opt.MapFrom(src => src.Cards));
        CreateMap<Class, ClassDto>()
            .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User.Username));
        CreateMap<Card, CardDto>();
    }
}