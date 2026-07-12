# StockFolio

StockFolio is a two-week internship portfolio project that simulates stock trading with a virtual account.

## Goals
- Build a responsive web app for mock stock trading
- Demonstrate authentication, CRUD, external API integration, and basic portfolio calculations
- Deliver a deployable MVP with a clear README and demo flow

## Stack
- Frontend: React + TypeScript + Vite
- Backend: ASP.NET Core Web API + C#
- Database: MySQL
- External data: Finnhub API

## Run locally

### Backend
```bash
cd backend/Stockfolio.Api
 dotnet restore
 dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

> Secrets (DB connection string, Finnhub API key) are kept in .NET User Secrets locally and are **not** committed. Set them with:
> ```bash
> cd backend/Stockfolio.Api
> dotnet user-secrets set "ConnectionStrings:DefaultConnection" "server=localhost;port=3306;database=stockfolio;user=root;password=YOUR_PASSWORD"
> dotnet user-secrets set "APIKeys:Finnhub_API" "YOUR_FINNHUB_KEY"
> ```

## Progress

### Done
- ASP.NET Core Web API project scaffolded, EF Core + Pomelo MySQL configured
- `User` / `Holding` / `Transaction` entities and `StockfolioDbContext` (decimal column types match the spec)
- JWT authentication: `POST /api/auth/register` (grants $100,000 virtual seed cash) and `POST /api/auth/login`
- Passwords hashed with BCrypt
- Dev CORS policy for the Vite frontend
- React + TypeScript + Vite frontend scaffolded

### Next
- EF Core migration + first MySQL schema push
- Finnhub proxy endpoints (`/api/stocks/search`, `/api/stocks/quote`) via `IHttpClientFactory`
- Buy/sell service logic (`PortfolioService`, `TransactionService`)
- Portfolio/summary/transaction-history endpoints
- Frontend: auth screens, stock search + trade form, portfolio dashboard

## Notes
- Market data is delayed because the project uses Finnhub's free tier.
- API keys should remain on the backend side.
