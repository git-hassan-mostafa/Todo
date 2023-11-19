using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AspTodo.Models;
using AspTodo1.Controllers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace AspTodo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase


    {
        public TodoDbContext _context;
        public UserDbContext _userContext;
        public StatusDbContext _statusContext;
        public ImportanceDbContext _importanceContext;

        public TodoController(TodoDbContext context, UserDbContext userContext , ImportanceDbContext importanceContext , StatusDbContext statusContext)
        {
            _context = context;
            _userContext = userContext;
            _importanceContext = importanceContext;
            _statusContext = statusContext;


        }

        //[Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoDto>>> GetTodoItems()
        {
            var todos = await _context.Todos.OrderByDescending(todoItem => todoItem.Id).Select(todoItem => new TodoDto {
        ID = todoItem.Id,
        Title = todoItem.Title,
        Category = todoItem.Category,
        DueDate = todoItem.DueDate,
        Estimate = todoItem.Estimate,

        // Assign foreign key values
        UserID = todoItem.UserID,
        StatusID = todoItem.StatusID,
        ImportanceID = todoItem.ImportanceID
    })
    .ToListAsync();
            return todos;
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodoItem(int id)
        {
            var todoItem = await _context.Todos.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return Ok(ItemToDTO(todoItem));
        }


        //[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodoItem(int id, TodoDto todo)
        {
            var todoItem = await _context.Todos.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            if (todo.Title != null)
            {
                todoItem.Title = todo.Title;
            }

            if (todo.Category != null)
            {
                todoItem.Category = todo.Category;
            }

            if (todo.DueDate != null)
            {
                todoItem.DueDate = todo.DueDate;
            }

            if (todo.Estimate != null)
            {
                todoItem.Estimate = todo.Estimate;
            }

            // Assign foreign key values
            if(todo.StatusID !=0) todoItem.StatusID = todo.StatusID;
            
            if (todo.ImportanceID!=0) todoItem.ImportanceID = todo.ImportanceID;

            try
            {
                var rowsAffected = await _context.SaveChangesAsync();

                if (rowsAffected > 0)
                {
                    return NoContent();
                }
                else
                {
                    // The update was not successful
                    return StatusCode(500, "Internal Server Error");
                }
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException) when (!TodoItemExists(id))
            {
                return NotFound();
            }
        }



        //[Authorize]
        [HttpPost]
        public async Task<ActionResult<Todo>> AddTodoItem(TodoDto todo)
        {
                try
                {
                    // Check if there are any users in the database
                    if (!_userContext.Users.Any())
                    {
                    // If no users exist, add a new user
                    var hmac = new HMACSHA512();

                    var user = new AppUser
                    {
                        UserName = "hassan@gmail.com",
                        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("12345")),
                        PasswordSalt = hmac.Key,

                    };

                    _userContext.Users.Add(user);
                        await _userContext.SaveChangesAsync();
                    }

                // Assign the parsed user ID to the todo item
                var todoItem = new Todo
                    {
                        Title = todo.Title,
                        Category = todo.Category,
                        DueDate = todo.DueDate,
                        Estimate = todo.Estimate,
                        UserID = 1,
                        // Assign foreign key values
                        StatusID = todo.StatusID,
                        ImportanceID = todo.ImportanceID
                    };

                    _context.Todos.Add(todoItem);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, ItemToDTO(todoItem));
                }
                catch (Exception ex)
                {
                    // Handle database-related exceptions
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
        }




        //[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var todoItem = await _context.Todos.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _context.Todos.Remove(todoItem);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle database-related exceptions
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

            return NoContent();
        }


        [Authorize]
        [HttpGet("user-todos")]
        public async Task<ActionResult<IEnumerable<TodoDto>>> GetUserTodosAsync()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userIdString = userIdClaim?.Value;

                if (int.TryParse(userIdString, out int userId))
                {
                    var user = await _userContext.Users.FindAsync(userId);

                    if (user == null)
                    {
                        return Unauthorized("You are not authorized");
                    }

                    // Retrieve todos for the current user
                    var userTodos = await _context.Todos
                        .Where(todo => todo.UserID == userId).Select(todoItem => new TodoDto
                        {
                            ID = todoItem.Id,
                            Title = todoItem.Title,
                            Category = todoItem.Category,
                            DueDate = todoItem.DueDate,
                            Estimate = todoItem.Estimate,

                            // Assign foreign key values
                            UserID = todoItem.UserID,
                            StatusID = todoItem.StatusID,
                            ImportanceID = todoItem.ImportanceID
                        }).ToListAsync();
                    return Ok(userTodos);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                // Handle database-related exceptions
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }



        //[Authorize]
        [HttpGet("search-todos")]
        public async Task<ActionResult<IEnumerable<TodoDto>>> SearchTodosAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrEmpty(searchTerm))
                {
                    return Ok(new TodoDto[0]);
                }

                //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                //var userIdString = userIdClaim?.Value;

                //if (int.TryParse(userIdString, out int userId))
                //{
                    // Query todos based on the search term and user ID
                    var matchingTodos = await _context.Todos
                        .Where(todo => todo.Title.Contains(searchTerm)).OrderByDescending(todoItem => todoItem.Id).Select(todoItem => new TodoDto
                        {
                            ID = todoItem.Id,
                            Title = todoItem.Title,
                            Category = todoItem.Category,
                            DueDate = todoItem.DueDate,
                            Estimate = todoItem.Estimate,

                            // Assign foreign key values
                            UserID = todoItem.UserID,
                            StatusID = todoItem.StatusID,
                            ImportanceID = todoItem.ImportanceID
                        }).ToListAsync();
                    return Ok(matchingTodos);
                //}

                //return BadRequest("User ID claim is not valid.");
            }
            catch (Exception ex)
            {
                // Handle database-related exceptions
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        private static TodoDto ItemToDTO(Todo todoItem) =>
    new TodoDto
    {
        ID = todoItem.Id,
        Title = todoItem.Title,
        Category = todoItem.Category,
        DueDate = todoItem.DueDate,
        Estimate = todoItem.Estimate,

        // Assign foreign key values
        UserID = todoItem.UserID,
        StatusID = todoItem.StatusID,
        ImportanceID = todoItem.ImportanceID
    };

        [HttpGet("statuses")]
        public async Task<ActionResult<IEnumerable<Status>>> GetStatuses()
        {
            return await _statusContext.Statuses.ToListAsync();
        }
        
        [HttpGet("importances")]
        public async Task<ActionResult<IEnumerable<Importance>>> GetImportances()
        {
            return await _importanceContext.Importances.ToListAsync();
        }


        private bool TodoItemExists(long id) =>
             _context.Todos.Any(e => e.Id == id);
    }
}
