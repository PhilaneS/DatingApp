using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public static class Seed
    {
        public static void SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager) 
        {
            if(!userManager.Users.Any()){
                var userData = System.IO.File.ReadAllText("Data/userSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                var roles = new List<Role> 
                {
                    new Role { Name="Admin" },
                    new Role { Name="Member" },
                    new Role { Name="Moderator" },
                    new Role { Name="VIP" }
                };

                foreach (var role in roles)
                {
                    roleManager.CreateAsync(role).Wait();
                } 

                foreach (var user in users)
                {
                    user.Gender = user.Gender.ToLower();
                    userManager.CreateAsync(user,"password").Wait();
                    userManager.AddToRoleAsync(user,"Member");
                }

                //Add admin user
                var adminUser = new User {
                    UserName = "Admin"
                };
                var result =  userManager.CreateAsync(adminUser,"password").Result;

                if(result.Succeeded)
                {
                    var admin = userManager.FindByNameAsync("Admin").Result;

                    userManager.AddToRolesAsync(admin, new [] {"Admin","Moderator"});
                }
                
            }
        }
      
    }
    
}