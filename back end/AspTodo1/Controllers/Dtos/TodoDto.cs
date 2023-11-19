using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspTodo1.Controllers.Dtos
{
    public class TodoDto
    {
        public int ? ID  {get;set;}
        public string Title { get; set; }
        public string Category { get; set; }
        public string DueDate { get; set; }
        public string Estimate { get; set; }
        public int UserID { get; set; }
        public int StatusID { get; set; }
        public int ImportanceID { get; set; }
    }
}
