# ai세금 (aitax)

ChatGPT 느낌의 세금 상담 UI MVP.

## 실행 (데모)

```bash
cd /workspace
npm install
npm run demo
```

브라우저에서 `http://localhost:3000` 로 접속하세요.

원격/컨테이너 환경이면 **포트(3000) 포워딩/Preview**로 열린 주소로 접속해야 합니다.

## 개발 실행

```bash
npm run dev
```

## OpenAI 연결(선택)

```bash
export OPENAI_API_KEY="YOUR_KEY"
export OPENAI_MODEL="gpt-4o-mini"  # 선택
npm run dev
```

`OPENAI_API_KEY`가 없으면 자동으로 **데모 모드** 응답을 사용합니다.
