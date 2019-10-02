using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User,UserForListDto>().ForMember(destnation => 
            destnation.PhotoUrl, options => options.MapFrom(source => 
            source.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(des => des.Age, opt => opt.MapFrom(src => 
            src.DateOfBirth.CalculateAge()));
            
            CreateMap<User,UserForDetailedDto>().ForMember(destnation => 
            destnation.PhotoUrl, options => options.MapFrom(source => 
            source.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(des => des.Age, opt => opt.MapFrom(src => 
            src.DateOfBirth.CalculateAge()));
        }
    }
}