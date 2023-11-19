using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AspTodo.Controllers.Interfaces;
using AspTodo.Controllers.Services;
using AspTodo.Models;


namespace AspTodo.Extentions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<ITokenService, TokenService>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Latest);

            //services.AddTransient<IBookService, BookService>();



            services.AddDbContext<UserDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DevConnection")));

            return services;
        }
    }
}
