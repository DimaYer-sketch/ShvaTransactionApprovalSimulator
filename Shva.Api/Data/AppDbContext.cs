using Microsoft.EntityFrameworkCore;
using Shva.Api.Models;
using System.Collections.Generic;

namespace Shva.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();
}