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

> The app currently uses a local MySQL connection string and a development JWT key. Update them before deployment.

## Notes
- Market data is delayed because the project uses Finnhub's free tier.
- API keys should remain on the backend side.
