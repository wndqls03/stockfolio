# StockFolio — 모의 투자 포트폴리오 웹앱

> 인턴 지원용 풀스택 포트폴리오 프로젝트 (반응형 웹앱, 모바일 대응)
> Stack: React (반응형 frontend) · ASP.NET Core Web API / C# (backend) · MySQL (database)
> 외부 데이터: Finnhub 무료 API (주식 시세)
> 목표 기간: 2주 (MVP 완성 + 배포 + README)

---

## 1. 프로젝트 개요

실제 돈 없이 가상으로 주식을 매수/매도하고, 내 보유 종목과 수익률을 추적하는 모의 투자 앱.
반응형으로 만들어 모바일 브라우저에서 앱처럼 사용 가능.

**어필 포인트:** 인증 + CRUD + 외부 API 연동 + 데이터 집계를 한 프로젝트에 담아 실무 기본기를 종합적으로 보여줌.

**설계 원칙:** 2주 안에 "배포된 완성품"이 최우선. MVP를 먼저 100% 완성한 뒤에만 Nice-to-have에 손댈 것.

---

## 2. 외부 API — Finnhub (중요)

⚠️ **Yahoo Finance 공식 API는 2017년에 종료됨.** 비공식 스크래핑은 데모 중 예고 없이 끊길 수 있어 포트폴리오에 부적합. 정식 무료 API인 **Finnhub**를 사용.

- 무료 티어: 분당 60회 호출, 약 20분 지연 데이터 (데모용으로 충분)
- 가입 후 무료 API 키 발급 (finnhub.io)
- 주요 엔드포인트:
  - 현재 시세(Quote): `GET /quote?symbol=AAPL`
  - 심볼 검색: `GET /search?q=apple`
  - 회사 프로필: `GET /stock/profile2?symbol=AAPL`

> ⚠️ API 키는 **백엔드에만** 보관. 프론트에 노출 금지. 프론트는 백엔드를 통해서만 시세를 받아옴 (키 보호 + CORS 회피 + 실무 패턴 어필).
> 지연 데이터라 "실시간 아님"을 UI에 명시하면 오히려 성실해 보임.

---

## 3. 기능 명세

### MVP (필수)

1. **회원가입 / 로그인** — JWT 인증. 가입 시 가상 시드머니(예: $100,000) 지급
2. **종목 검색** — Finnhub 검색으로 심볼 찾기 + 현재가 표시
3. **매수 / 매도** — 수량 입력해 가상 거래. 잔고에서 차감/가산
4. **보유 종목(Portfolio)** — 종목별 보유 수량, 평균 매입가, 현재가, 평가손익
5. **거래 내역(History)** — 매수/매도 기록 목록
6. **요약 대시보드** — 총 자산(현금+평가액), 총 수익률, 현금 잔고

### Nice-to-have (MVP 완성 후에만)

- 종목 상세 페이지 + 가격 차트 (Finnhub candle 데이터 + Recharts)
- 워치리스트(관심 종목 즐겨찾기)
- 포트폴리오 비중 파이 차트
- 자산 변화 추이 그래프

---

## 4. 데이터베이스 스키마 (MySQL)

```
Users
  id              INT PK AUTO_INCREMENT
  email           VARCHAR UNIQUE
  password_hash   VARCHAR
  cash_balance    DECIMAL(18,2)   -- 가상 현금 잔고 (가입 시 시드머니)
  created_at      DATETIME

Holdings                          -- 현재 보유 종목
  id              INT PK AUTO_INCREMENT
  user_id         INT FK -> Users.id
  symbol          VARCHAR         -- "AAPL"
  quantity        DECIMAL(18,4)
  avg_buy_price   DECIMAL(18,2)   -- 평균 매입 단가
  UNIQUE(user_id, symbol)

Transactions                      -- 거래 내역
  id              INT PK AUTO_INCREMENT
  user_id         INT FK -> Users.id
  symbol          VARCHAR
  type            VARCHAR         -- "BUY" | "SELL"
  quantity        DECIMAL(18,4)
  price           DECIMAL(18,2)   -- 거래 당시 단가
  created_at      DATETIME
```

> 매수 시: Holdings 갱신(평균단가 재계산) + Transactions 추가 + cash_balance 차감.
> 매도 시: Holdings 수량 감소(0이면 삭제) + Transactions 추가 + cash_balance 가산.
> 이 로직을 백엔드 서비스 계층에 깔끔히 분리하면 어필 포인트.

---

## 5. API 설계 (ASP.NET Core Web API)

```
POST   /api/auth/register           회원가입 (시드머니 지급)
POST   /api/auth/login              로그인 → JWT 반환

GET    /api/stocks/search?q=        종목 검색 (Finnhub 프록시)
GET    /api/stocks/quote?symbol=    현재가 조회 (Finnhub 프록시)

GET    /api/portfolio               보유 종목 + 평가손익 (현재가 반영)
GET    /api/portfolio/summary       총자산·수익률·현금잔고

POST   /api/transactions/buy        매수  { symbol, quantity }
POST   /api/transactions/sell       매도  { symbol, quantity }
GET    /api/transactions            거래 내역 목록
```

- /api/portfolio, /api/transactions는 JWT 인증 필요. 본인 데이터만 접근.
- /api/stocks/* 는 서버에서 Finnhub 호출(API 키 서버 보관). 잦은 호출 방지 위해 짧은 캐싱(예: 30초) 고려.

---

## 6. 기술 구성

### Backend (C# / ASP.NET Core Web API)
- EF Core + `Pomelo.EntityFrameworkCore.MySql`
- JWT 인증 (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- 비밀번호 해싱 (BCrypt 또는 PasswordHasher)
- Finnhub 호출: `HttpClient` + `IHttpClientFactory`, API 키는 appsettings/환경변수
- 거래 로직은 서비스 계층으로 분리 (PortfolioService, TransactionService)
- CORS: 프론트 도메인 허용

### Frontend (React, 반응형)
- 반응형 레이아웃: 모바일 우선(mobile-first) CSS. 브라우저에서 앱처럼 보이게
- 스타일: Tailwind (반응형 유틸리티가 빠름) 또는 MUI
- 상태관리: useState + Context (Redux 불필요)
- HTTP: axios (JWT를 Authorization 헤더에 첨부)
- 차트(Nice-to-have): Recharts
- 라우팅: react-router

### Database
- MySQL 8.x (로컬 개발 → 배포 시 호스팅)

---

## 7. 2주 개발 일정

### Week 1 — 백엔드 + API 연동 + 프론트 기초

- **Day 1** — 환경 세팅: ASP.NET Web API + MySQL + EF Core 연결 확인, React 프로젝트 생성, Finnhub 가입 후 API 키 발급 & 테스트 호출.
- **Day 2** — DB 모델(Users, Holdings, Transactions) + 마이그레이션. JWT 인증(register/login) + 가입 시 시드머니 지급.
- **Day 3** — Finnhub 프록시 엔드포인트(search, quote) 구현 + 테스트. 매수/매도 서비스 로직(잔고·보유·평균단가 계산) 구현.
  - ⚠️ 체크포인트: Day 3까지 매수/매도 로직이 안 끝나면 Nice-to-have 전부 버리고 MVP에 집중.
- **Day 4** — 포트폴리오/요약/거래내역 API 완성. Postman으로 백엔드 "완성" 상태로.
- **Day 5** — React: 로그인/회원가입 화면 + 토큰 저장 + axios 연동. 반응형 레이아웃 기초.

### Week 2 — 화면 연결 + 배포 + 제출

- **Day 6** — 종목 검색 화면 + 현재가 표시 + 매수/매도 폼.
- **Day 7** — 보유 종목(Portfolio) 화면 + 평가손익 표시 + 요약 대시보드.
- **Day 8** — 거래 내역 화면 + 반응형 UI 다듬기(모바일 화면 확인). 기능 마감.
- **Day 9** — 배포: 프론트(Vercel) + 백엔드(Railway/Azure) + MySQL 호스팅. Finnhub 키 환경변수 설정.
  - ⚠️ 배포는 예상보다 오래 걸림. 하루 버퍼 확보.
- **Day 10** — 버그 수정, 영어 README, 스크린샷 + 데모 영상(모바일 화면 포함), 이력서에 링크 정리.

여유 이틀(주말)은 버퍼로 남겨둘 것.

---

## 8. 제출용 체크리스트

- [ ] 배포된 라이브 URL (모바일 브라우저에서도 정상 동작 확인)
- [ ] GitHub 저장소
- [ ] **영어 README**: 실행법, 기능, 기술 스택, 스크린샷, 고민한 점, Finnhub 키 설정법
- [ ] 데모 영상 (2~3분, 매수→포트폴리오→수익률 흐름 + 모바일 화면 시연)
- [ ] 이력서에 프로젝트 링크 정리

> "실시간 아님(지연 데이터)"을 UI/README에 명시하면 성실한 인상.
> API 키를 백엔드에 숨긴 점을 README에 언급하면 보안 감각 어필.

---

## 9. Claude Code 작업 시작 방법

이 파일을 프로젝트 루트에 두고, Claude Code에게:

> "STOCKFOLIO_SPEC.md를 참고해서 백엔드부터 시작해줘. Day 1~2 범위: ASP.NET Core Web API 프로젝트 구조, Users/Holdings/Transactions 엔티티, EF Core DbContext + MySQL 연결, JWT 인증(register/login) + 가입 시 시드머니 지급까지 만들어줘."

이후 일정표의 Day 단위로 진행. Finnhub API 키는 발급받아 백엔드 환경변수(appsettings 또는 user-secrets)에 넣을 것.
