using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AspTodo.Models
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppUser>(u =>
            {
                u.HasKey(e => e.Id);
                u.HasMany(e => e.Todos).WithOne(e=>e.User).HasForeignKey(e=>e.UserID).IsRequired();
                u.Property(e => e.UserName).IsRequired();
                u.Property(e => e.PasswordHash).IsRequired();
                u.Property(e => e.PasswordSalt).IsRequired();
            });
        }
    }

}
