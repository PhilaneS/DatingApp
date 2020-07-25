using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        public AdminController(DataContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;

        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await _context.Users
            .OrderBy(x => x.UserName)
            .Select(user => new
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = (from userRole in user.UserRoles
                         join role in _context.Roles
                         on userRole.RoleId
                         equals role.Id
                         select role.Name).ToList()
            }).ToListAsync();
            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> editRoles(string userName, RoleEditDto editRole)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var selectedRoles = editRole.RoleNames;

            selectedRoles = selectedRoles ?? new string[]{};

            var result= await _userManager.AddToRolesAsync(user,selectedRoles.Except(userRoles));

            if(!result.Succeeded)
                return BadRequest("Failed to add user Roles");

            result = await _userManager.RemoveFromRolesAsync(user,userRoles.Except(selectedRoles));

            if(!result.Succeeded)
                return BadRequest("Failed to remove the roles");

            return Ok(await _userManager.GetRolesAsync(user));

        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public IActionResult GetPhotosForModeration()
        {
            return Ok("admin or moderator can see this");
        }
    }
}