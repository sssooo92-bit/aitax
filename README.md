# ai세금 (aitax)

ChatGPT 느낌의 세금 상담 UI MVP.

## 실행 (데모)

### Windows (가장 쉬운 방법)

- `run-demo.bat` 더블클릭 (또는 PowerShell에서 `run-demo.ps1`)

또는 터미널에서:

```bash
npm install
npm run demo
```

`npm run demo`는 실행 후 **브라우저를 자동으로 열어줍니다**. (원하면 `AITAX_NO_OPEN=1`로 자동 오픈 끄기)

### macOS / Linux

```bash
npm install
npm run demo
```

실행하면 터미널에 접속 주소가 출력됩니다.

원격/컨테이너 환경이면 **포트(3000) 포워딩/Preview**로 열린 주소로 접속해야 합니다.

## 개발 실행

```bash
npm run dev
```

## 프로덕션처럼 실행

```bash
npm run start
```

## OpenAI 연결(선택)

```bash
export OPENAI_API_KEY="YOUR_KEY"
export OPENAI_MODEL="gpt-4o-mini"  # 선택
npm run dev
```

`OPENAI_API_KEY`가 없으면 자동으로 **데모 모드** 응답을 사용합니다.
