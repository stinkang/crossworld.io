using Microsoft.EntityFrameworkCore;
using CrossWorldApp;
using CrossWorldApp.Repositories;
using CrossWorldApp.Services;
using Microsoft.AspNetCore.Http;
using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using React.AspNet;
using Microsoft.AspNetCore.Identity;
using CrossWorldApp.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<ITestCrosswordRepository, TestCrosswordRepository>();
builder.Services.AddTransient<IDraftRepository, DraftRepository>();
builder.Services.AddTransient<ICrosswordRepository, CrosswordRepository>();
builder.Services.AddTransient<ICrossworldUserService, CrossworldUserService>();
builder.Services.AddTransient<IDraftService, DraftService>();

builder.Services.AddReact();

// Make sure a JS engine is registered, or you will get an error!
builder.Services.AddJsEngineSwitcher(options => options.DefaultEngineName = ChakraCoreJsEngine.EngineName).AddChakraCore();

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add the DbContext and the Repository to the services.
builder.Services.AddDbContext<CrossWorldDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDefaultIdentity<CrossworldUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<CrossWorldDbContext>();

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;

    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedPhoneNumber = false;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    // Cookie settings
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(4);

    options.LoginPath = "/Account/Login";
    //options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
});

builder.Services.AddScoped<ICrosswordRepository, CrosswordRepository>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

// Initialise ReactJS.NET. Must be before static files.
app.UseReact(config =>
{
    // If you want to use server-side rendering of React components,
    // add all the necessary JavaScript files here. This includes
    // your components as well as all of their dependencies.
    // See http://reactjs.net/ for more information. Example:
    // config
    //     .SetReuseJavaScriptEngines(true)
    //     .SetLoadBabel(false)
    //     .SetLoadReact(false)
    //     .SetReactAppBuildPath("~/dist");

    // If you use an external build too (for example, Babel, Webpack,
    // Browserify or Gulp), you can improve performance by disabling
    // ReactJS.NET's version of Babel and loading the pre-transpiled
    // scripts. Example:
    //config
    //    .SetLoadBabel(false)
    //    .AddScriptWithoutTransform("~/Scripts/bundle.server.js");
});

app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();;

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();