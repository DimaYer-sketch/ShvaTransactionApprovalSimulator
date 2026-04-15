# Shva Transaction Approval Simulator

Full-stack implementation of the Shva interview task.

---

## Tech Stack

Frontend:

- React
- Responsive UI
- i18n (English / Hebrew, RTL support)

Backend:

- .NET 8 Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

Infrastructure:

- Docker Compose (client + server + database)

---

## Features

- Transaction simulation by region and time
- Server-side approval logic (08:00–18:00 local time)
- UTC → Local time conversion
- Persistent storage in database
- Approved transactions view (carousel)
- Language switch (ENG / Hebrew)
- Logout + token handling

---

## Run Locally

### Backend

```bash
cd Shva.Api
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd shva-client
npm install
npm start
```

---

## Run With Docker

```bash
From the project root:

docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Authentication

```
username: admin
password: 1234
```

---

## Demo Video

https://www.loom.com/share/b68fb098da614ebbbe55dce01a5a7cb6

---

## Author

Dmitry Yerukhimovich
