using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AspTodo.Models
{
    [Table("Todos")]
    public class Todo
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Category { get; set; }
        public string DueDate { get; set; }
        public string Estimate { get; set; }

        public int UserID { get; set; }
        public AppUser User { get; set; }

        [Required]
        public int StatusID { get; set; }
        public Status Status { get; set; }

        public int ImportanceID { get; set; }
        public Importance Importance { get; set; }
    }

}
