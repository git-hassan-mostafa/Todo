using Microsoft.EntityFrameworkCore;

namespace AspTodo.Models
{
    public class TodoDbContext:DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {

        }

        public DbSet<Todo> Todos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Todo>(u =>
            {
                u.HasKey(e => e.Id);
                u.Property(e => e.Title).IsRequired();
                u.Property(e => e.Category);
                u.Property(e => e.DueDate);
                u.Property(e => e.Estimate);
                u.HasOne(t => t.User).WithMany(t => t.Todos).HasForeignKey(t => t.UserID);
                u.HasOne(t => t.Status).WithMany(t=>t.Todos).HasForeignKey(t=>t.ImportanceID).IsRequired();
                u.HasOne(t => t.Importance).WithMany(t=>t.Todos).HasForeignKey(t=>t.StatusID);
            });
        }
    }
}
