using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        public UserController(IDatingRepository repo, IMapper mapper, UserManager<User> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> getUsers([FromQuery] UserParams userParams)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            IEnumerable<Claim> claims = identity.Claims;

            var claim = claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault();

            //var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            //var userFromRepo = await _repo.GetUser(currentUserId);

            var currentUser = await _userManager.FindByIdAsync(claim.Value);

            userParams.UserId = currentUser.Id;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }


            var currentUsers = _userManager.Users.OrderByDescending(o => o.LastActive).AsQueryable();
             currentUsers = currentUsers.Where(u => u.Id != userParams.UserId);

            currentUsers = currentUsers.Where(u => u.Gender == userParams.Gender.ToLower());

             if(userParams.Likers) {
                var userLikers = await GetUserLikes(userParams.UserId,userParams.Likers);
                currentUsers = currentUsers.Where(u => userLikers.Contains(u.Id));
            }
            if (userParams.Likees) {
                var userLikees = await GetUserLikes(userParams.UserId,userParams.Likers);
                currentUsers = currentUsers.Where(u => userLikees.Contains(u.Id));
            }

            if(userParams.MinAge !=18 || userParams.MaxAge !=99) {

                var minDob = DateTime.Today.AddYears(-userParams.MinAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MaxAge);

                currentUsers = currentUsers.Where(u => u.DateOfBirth <= minDob && u.DateOfBirth >= maxDob );
            }
            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                     currentUsers = currentUsers.OrderByDescending(o => o.Created);
                     break;
                    default:
                     currentUsers = currentUsers.OrderByDescending(o => o.LastActive);
                     break;
                }
               
            }

           var users = await PageList<User>.CreateAsync(currentUsers,userParams.pageNumber,userParams.PageSize);


            var usersToReturn =  _mapper.Map<IEnumerable<UserForListDto>>(currentUsers);
            

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> getUser(int id)
        {
            var user = await _repo.GetUser(id);

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"updating user {id} failed on save");
        }
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var like = await _repo.GetLike(id, recipientId);

            if (like != null)
            {
                return BadRequest("You alreday liked this user");
            }

            if (await _repo.GetUser(recipientId) == null)
            {
                return NotFound();
            }

            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(like);

            if (await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Failed to like the user");
        }
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers) {

            var user = await _userManager.FindByIdAsync(id.ToString());

            if(likers)             
                return  user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            else
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            
        }
    }
}