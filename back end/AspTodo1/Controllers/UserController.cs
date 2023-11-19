using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AspTodo.Controllers.Dtos;
using AspTodo.Controllers.Interfaces;
using AspTodo.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AspTodo.Controllers


{
    [Route("api/[controller]")]
    [ApiController]


    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly ITokenService _tokenService;

        public UserController(UserDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }


        [Authorize]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<AppUser>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            var User = await _context.Users.FindAsync(id);

            if (User == null)
            {
                return NotFound();
            }

            return Ok(User);
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<ActionResult<AppUser>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userIdString = userIdClaim?.Value;

            if (int.TryParse(userIdString, out int userId))
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return Unauthorized("You are not authorized");
                }

                return Ok(user);
            }

            return Unauthorized("Invalid user ID");


        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(Dto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("UserName Is Already Taken");
            var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,

            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }



        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(Dto loginDto)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid UserName");

            var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Incorrect Password");
            }
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };


        }
    }
}
