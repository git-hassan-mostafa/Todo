using Microsoft.EntityFrameworkCore;

namespace AspTodo.Models
{
    public class StatusDbContext:DbContext
    {
        public StatusDbContext(DbContextOptions<StatusDbContext> options) : base(options)
        {

        }

        public DbSet<Status> Statuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Status>(u =>
            {
                u.HasKey(e => e.Id);
                u.HasMany(e => e.Todos).WithOne(e => e.Status).HasForeignKey(e => e.StatusID).IsRequired();
                u.Property(e => e.Name);
            });
        }
    }
}
