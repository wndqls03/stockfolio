# StockFolio — Mock Stock Trading Portfolio Web App

> Full-stack portfolio project (responsive web app, mobile-friendly)
> Stack: React (responsive frontend) · ASP.NET Core Web API / C# (backend) · MySQL (database)
> External data: Finnhub free API (stock quotes)

---

## 1. Project Overview

A mock trading app for buying and selling stocks with virtual money, tracking holdings and returns without any real money involved.
Built responsively so it works like a native app in a mobile browser.

**Highlights:** Combines auth, CRUD, external API integration, and data aggregation in a single project to demonstrate well-rounded fundamentals.

**Design principle:** A finished, deployed product is the priority. Fully complete the MVP before touching any nice-to-haves.

---

## 2. External API — Finnhub (important)

⚠️ The official Yahoo Finance API was discontinued in 2017. Unofficial scraping can break without warning during a demo, making it unsuitable for a portfolio project. Use **Finnhub**, an official free API, instead.

- Free tier: 60 calls/minute, ~20 min delayed data (sufficient for a demo)
- Free API key available after signing up at finnhub.io
- Key endpoints:
  - Current quote: `GET /quote?symbol=AAPL`
  - Symbol search: `GET /search?q=apple`
  - Company profile: `GET /stock/profile2?symbol=AAPL`

> ⚠️ Keep the API key **backend-only** — never expose it to the frontend. The frontend should only receive quotes through the backend (protects the key, avoids CORS issues, and demonstrates a real-world pattern).
> Since the data is delayed, stating "not real-time" in the UI actually comes across as diligent.

---

## 3. Feature Spec

### MVP (required)

1. **Sign up / Log in** — JWT auth. Grants virtual seed money (e.g. $100,000) on signup
2. **Stock search** — find symbols via Finnhub search + show current price
3. **Buy / sell** — enter a quantity to trade virtually; deduct from or add to balance
4. **Holdings (Portfolio)** — per-symbol quantity held, average buy price, current price, unrealized P/L
5. **Transaction history** — list of buy/sell records
6. **Summary dashboard** — total assets (cash + market value), overall return, cash balance

### Nice-to-have (only after the MVP is complete)

- Stock detail page + price chart (Finnhub candle data + Recharts)
- Watchlist (favorite symbols)
- Portfolio allocation pie chart
- Asset value over time graph

---

## 4. Database Schema (MySQL)

```
Users
  id              INT PK AUTO_INCREMENT
  email           VARCHAR UNIQUE
  password_hash   VARCHAR
  cash_balance    DECIMAL(18,2)   -- virtual cash balance (seed money on signup)
  created_at      DATETIME

Holdings                          -- current holdings
  id              INT PK AUTO_INCREMENT
  user_id         INT FK -> Users.id
  symbol          VARCHAR         -- "AAPL"
  quantity        DECIMAL(18,4)
  avg_buy_price   DECIMAL(18,2)   -- average buy price
  UNIQUE(user_id, symbol)

Transactions                      -- transaction history
  id              INT PK AUTO_INCREMENT
  user_id         INT FK -> Users.id
  symbol          VARCHAR
  type            VARCHAR         -- "BUY" | "SELL"
  quantity        DECIMAL(18,4)
  price           DECIMAL(18,2)   -- price at time of trade
  created_at      DATETIME
```

> On buy: update Holdings (recalculate average price) + add a Transaction + deduct cash_balance.
> On sell: reduce Holdings quantity (remove the row if it reaches zero) + add a Transaction + credit cash_balance.
> Keeping this logic cleanly separated in a backend service layer is a strong point.

---

## 5. API Design (ASP.NET Core Web API)

```
POST   /api/auth/register           Sign up (grants seed money)
POST   /api/auth/login              Log in → returns JWT

GET    /api/stocks/search?q=        Search symbols (Finnhub proxy)
GET    /api/stocks/quote?symbol=    Get current price (Finnhub proxy)

GET    /api/portfolio               Holdings + unrealized P/L (using current prices)
GET    /api/portfolio/summary       Total assets, return, cash balance

POST   /api/transactions/buy        Buy   { symbol, quantity }
POST   /api/transactions/sell       Sell  { symbol, quantity }
GET    /api/transactions            List of transactions
```

- `/api/portfolio` and `/api/transactions` require JWT auth; users can only access their own data.
- `/api/stocks/*` call Finnhub server-side (API key stays on the server). Consider short-lived caching (e.g. 30s) to avoid excessive calls.

---

## 6. Tech Stack

### Backend (C# / ASP.NET Core Web API)
- EF Core + `Pomelo.EntityFrameworkCore.MySql`
- JWT auth (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- Password hashing (BCrypt or PasswordHasher)
- Finnhub calls via `HttpClient` + `IHttpClientFactory`; API key kept in appsettings/environment variables
- Trading logic separated into a service layer (PortfolioService, TransactionService)
- CORS: allow the frontend domain

### Frontend (React, responsive)
- Responsive layout: mobile-first CSS so it feels like an app in the browser
- Styling: Tailwind (fast responsive utilities) or MUI
- State management: useState + Context (no need for Redux)
- HTTP: axios (attach JWT in the Authorization header)
- Charts (nice-to-have): Recharts
- Routing: react-router

### Database
- MySQL 8.x (local dev → hosted for deployment)
