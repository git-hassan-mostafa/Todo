using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspTodo.Models;
using Microsoft.AspNetCore.Mvc;

namespace AspTodo1.Controllers.Interfaces
{
    public interface ITodoService
    {
        Task<ActionResult<IEnumerable<Todo>>> GetTodosAsync();
        Task<Todo> GetTodoByIdAsync(int id);
        Task AddTodoAsync(Todo todo);

        Task EditTodoAsync(int id);

        Task DeleteTodoAsync(int id);
        // Other methods for updating and deleting todos
    }
}
