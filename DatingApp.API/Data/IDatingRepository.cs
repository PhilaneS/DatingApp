using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
         void Add<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         Task <bool> SaveAll();         
         Task <PageList<User>> GetUsers(UserParams userParams);

         Task <User> GetUser(int Id);

         Task<Photo> GetPhoto(int id);

         Task<Photo> GetMainPhotoForUser(int userId);
         Task<Like> GetLike(int userid, int recipientId);

         Task<Message> GetMessage(int id);
         Task<PageList<Message>> GetMessagesForUser(MessageParams massageParams);

         Task<IEnumerable<Message>> GetMessageThred(int userId, int receptientId);
    }
}