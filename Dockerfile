# Stage 1: Build the frontend assets using Node.js
FROM node:16 AS frontend-build
WORKDIR /app/FrontEnd
# Copy package.json, package-lock.json (if available), and webpack.config.js
COPY WebApplication1/FrontEnd/package*.json WebApplication1/FrontEnd/webpack.config.js ./
COPY WebApplication1/FrontEnd/ ./
RUN npm install
RUN npm run build

# Note: After the npm run build, the frontend assets should be in /app/wwwroot/dist based on your webpack configuration

# Stage 2: Build the .NET app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Install the EF Core CLI
# RUN dotnet tool install --global dotnet-ef
# ENV PATH="${PATH}:/root/.dotnet/tools"

WORKDIR /src

COPY ["WebApplication1/CrossWorldApp.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/CrossWorldApp.csproj"
# Copy the built frontend assets from the frontend-build stage
COPY --from=frontend-build /app/wwwroot/dist WebApplication1/wwwroot/dist
# Copy the rest of the .NET application files
COPY . .
WORKDIR "/src/WebApplication1"
RUN dotnet build "CrossWorldApp.csproj" -c Release -o /app/build

# Stage 3: Publish the .NET app
FROM build AS publish
RUN dotnet publish "CrossWorldApp.csproj" -c Release -o /app/publish

# Stage 4: Assemble the final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
COPY --from=publish /app/publish .

COPY start.sh .

ENTRYPOINT ["/app/start.sh"]
