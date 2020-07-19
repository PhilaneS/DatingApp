using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public static class Seed
    {
        public static void SeedUsers(DataContext context) 
        {
            if(!context.Users.Any()){
                var userData = System.IO.File.ReadAllText("Data/userSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    byte[] passwordHash, passwordSalt;

                    CreatePasswordHash("password",out passwordHash,out passwordSalt);

                    // user.PasswordHash = Convert.ToBase64String(passwordHash);
                    // user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                    user.UserName = user.UserName.ToLower();
                    user.Gender = user.Gender.ToLower();
                    context.Users.Add(user);
                }

                context.SaveChanges();
            }
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new  System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt= hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }            
        }
    }
    
}