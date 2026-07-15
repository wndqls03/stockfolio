# Day 2 작업 가이드 — StockFolio

## 목표
- MySQL 연결 확인
- EF Core 모델/DbContext 정리
- JWT 인증(register/login) 완성
- 가입 시 시드머니 지급
- Finnhub API 키 설정 및 프록시 엔드포인트 준비

## 1. 백엔드 설정
- [ ] appsettings.json에 Finnhub 키 추가
- [ ] Program.cs에 AddHttpClient() 등록
- [ ] CORS 설정 확인 (프런트 호출 가능)

## 2. DB 연결
- [ ] MySQL 서버 실행 확인
- [ ] appsettings.json의 ConnectionStrings 수정
- [ ] DbContext 연결 확인
- [ ] EF Core 마이그레이션 생성
- [ ] 데이터베이스 반영

## 3. 인증 기능
- [ ] User 엔티티 확인
- [ ] AuthService에 register/login 로직 확인
- [ ] AuthController에 register/login 엔드포인트 확인
- [ ] 회원가입 시 cash_balance = 100000 지급
- [ ] JWT 토큰 발급 확인

## 4. Finnhub 연동 준비
- [ ] Finnhub API Key 발급
- [ ] 백엔드에서 환경변수 또는 appsettings로 키 읽기
- [ ] FinnhubService 생성
- [ ] /api/stocks/search 엔드포인트 구현
- [ ] /api/stocks/quote 엔드포인트 구현

## 5. 테스트
- [ ] POST /api/auth/register 테스트
- [ ] POST /api/auth/login 테스트
- [ ] GET /api/stocks/search?q=apple 테스트
- [ ] GET /api/stocks/quote?symbol=AAPL 테스트

## 6. 리뷰용 체크포인트
- [ ] 코드가 이해하기 쉽게 주석/설명 포함
- [ ] 민감한 키는 프런트에 노출하지 않음
- [ ] README나 주석에 Finnhub 사용 방식 설명
