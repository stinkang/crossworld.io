# Welcome to CrossWorld!

[crossworld.io](crossworld.io)

CrossWorld! is an open-source website for constructing and sharing crosswords. It runs an ASP.NET Core server on Azure, and has a React frontend implemented in TypeScript/JavaScript. Real-time gameplay uses Firebase Realtime Database, and a word database for Autofill is stored in Google Cloud storage.

# Development

```console
docker-compose build
```

```console
docker-compose up
```

The containerized setup is using a SQL Server 2019 container with data persistence. Alternatively, you can set up your own local database by adding a `DefaultConnection` string in appsettings.json.

Note: The Firebase container setup is still a WIP. As a result, real-time collaborative gameplay and the word database from Google Cloud storage do not work yet. 

# Contribution

Contributions are highly encouraged, and much needed! Right now, unit testing is minimal, and Continuous Integration needs to be set up (among other issues). If you are a crossword enthusiast or want to see a feature that hasn't been implemented yet, please submit a pull request!


