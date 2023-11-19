using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AspTodo.Models
{
    public class ImportanceDbContext:DbContext
    {
        public ImportanceDbContext(DbContextOptions<ImportanceDbContext> options):base(options)
        {

        }

        public DbSet<Importance> Importances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Importance>(u =>
            {
                u.HasKey(e => e.Id);
                u.HasMany(e => e.Todos).WithOne(e => e.Importance).HasForeignKey(e => e.ImportanceID).IsRequired();
                u.Property(e => e.Name);
            });
        }
    }
}
