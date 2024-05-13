using API.DTOs;
using API.Entities;
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
                    opt => opt.MapFrom(src => src.User.UserName));
        CreateMap<Deck, DeckWithCardsDto>()
            .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.Cards,
                    opt => opt.MapFrom(src => src.Cards));
        CreateMap<Class, ClassDto>()
            .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User.UserName));
        CreateMap<Class, ClassWithDeckDto>()
            .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.Decks,
                    opt => opt.MapFrom(src => src.Decks));
        CreateMap<Card, CardDto>();
    }
}