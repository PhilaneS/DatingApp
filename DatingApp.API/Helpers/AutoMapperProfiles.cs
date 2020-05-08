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
            CreateMap<User,UserForListDto>().ForMember(des => 
            des.PhotoUrl, options => options.MapFrom(source => 
            source.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(des => des.Age, opt => opt.MapFrom(src => 
            src.DateOfBirth.CalculateAge()));
            
            CreateMap<User,UserForDetailedDto>().ForMember(destnation => 
            destnation.PhotoUrl, options => options.MapFrom(source => 
            source.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(des => des.Age, opt => opt.MapFrom(src => 
            src.DateOfBirth.CalculateAge()));

            CreateMap<Photo,PhotoForDetailedDto>();
            CreateMap<UserForUpdateDto,User>();

            CreateMap<Photo,PhotoForReturnDto>();
            CreateMap<PhotosForCreationDto,Photo>();

            //CreateMap<User, UserForRegisterDto>();
            CreateMap<UserForRegisterDto,User>();

            CreateMap<MessageForCreationDto,Message>().ReverseMap();
            CreateMap<Message,MessageToReturnDto>().
            ForMember(m => m.SenderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(m => m.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
            
        }
    }
}