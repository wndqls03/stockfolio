# StockFolio

[![Backend Tests](https://github.com/wndqls03/stockfolio/actions/workflows/test.yml/badge.svg)](https://github.com/wndqls03/stockfolio/actions/workflows/test.yml)

🔗 **Live:** [https://stockfolio-nz.vercel.app](https://stockfolio-nz.vercel.app)

StockFolio is a mock stock trading app that simulates a portfolio with a virtual account.

## Features
- **Auth** — email/password sign-up and login (JWT). New accounts start with a virtual $100,000 in cash.
- **Stock search** — look up real symbols and current prices via Finnhub, proxied through the backend so the API key never reaches the browser.
- **Buy / sell** — trade at the live quoted price; cash balance and average cost basis update automatically.
- **Portfolio dashboard** — total assets, cash, overall return %, and per-holding unrealized P/L.
- **Transaction history** — full list of past buys and sells.
- **Responsive UI** — usable on both desktop and mobile.

## Stack
- Frontend: React + Vite (Tailwind CSS)
- Backend: ASP.NET Core Web API + C#
- Database: MySQL (EF Core + Pomelo)
- External data: Finnhub API
- Hosting: Vercel (frontend), Railway (backend + MySQL)

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

## Tests

```bash
cd backend/Stockfolio.Api.Tests
dotnet test
```

## Possible future additions
- Stock detail page with a price chart
- Watchlist
- Portfolio allocation pie chart
- Asset value over time graph

## Notes
- Market data is delayed (Finnhub free tier), not real-time.
- API keys stay server-side only — the frontend never sees them.

## Demonstration
<img width="2492" height="2432" alt="stockfolio-nz vercel app_trade (2)" src="https://github.com/user-attachments/assets/ab86d20f-3ece-481d-8707-c68cefe913fd" />
<img width="2492" height="2432" alt="stockfolio-nz vercel app_trade (3)" src="https://github.com/user-attachments/assets/3041473c-c854-4ebc-9e3a-475ffa8aec0e" />
<img width="2492" height="2432" alt="stockfolio-nz vercel app_trade (1)" src="https://github.com/user-attachments/assets/7f82226d-71af-4bbe-9513-6ad792f89e5a" />

