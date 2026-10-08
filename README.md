# 멋쟁이사자처럼 단국대학교 홈페이지

https://dku-likelion.vercel.app

Vite + React + TypeScript + Tailwind CSS v4로 만든 한 페이지짜리 사이트입니다. `main`에 푸시하면 Vercel이 자동으로 배포합니다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build/ 폴더에 결과물
```

> 프로젝트 폴더를 iCloud가 동기화하는 위치(데스크탑·문서)에 두지 마세요. 상위 폴더의 git 파일이 내려받아지지 않은 상태면 `npm run dev`와 `npm run build`가 "transforming..."에서 멈춥니다.

## 매년 고치는 곳

내용은 거의 전부 `src/data` 아래 두 파일에 있습니다. 화면 코드는 건드리지 않아도 됩니다.

### `src/data/site.ts`

| 항목 | 설명 |
| --- | --- |
| `generation` | 기수. 숫자 하나만 바꾸면 사이트 전체에 반영됩니다. |
| `tracks` | 트랙 소개, 커리큘럼, 도구 |
| `milestones` | 1년의 흐름. `projectsAnchor`를 넣으면 그 행사의 결과물로 연결됩니다. |
| `members` | 운영진. 사진은 `src/assets/member-N.webp` (세로 4:5, 가로 400px 정도) |
| `recruit` | 모집 일정과 지원서 주소 |
| `contact` | 이메일, 인스타그램, 주소 |

### 모집 열고 닫기

`recruit.isOpen`을 `true`로 바꾸고 `recruit.applyUrl`에 **실제 지원서 주소**를 넣으세요. 닫혀 있는 동안에는 버튼을 누르면 "현재 지원 기간이 아닙니다" 안내가 뜨고, 함께하기 섹션에서 다음 기수 **모집 알림 신청**(이메일)을 받습니다. 신청은 문의 폼과 같은 EmailJS 설정으로 동아리 메일에 "N기 모집 알림 신청" 제목으로 도착합니다. 모집이 열리면 받은 주소로 안내 메일을 보내고, 모집이 끝나면 지워 주세요(사이트에 그렇게 약속해 두었습니다).

자주 묻는 질문은 `site.ts`의 `faq`에서 고칩니다.

### `src/data/products.ts`

행사(아이디어톤, 해커톤…)별로 프로젝트를 적습니다. 한 해가 바뀌면 `productGroups`를 새 해의 행사로 바꾸세요.

| 필드 | 설명 |
| --- | --- |
| `name`, `tagline`, `description`, `category` | 카드에 나오는 기본 정보 |
| `image` | 대표 화면. `src/assets/products/`에 WebP로 넣고 위에서 import |
| `link` | 서비스 주소. 없으면 버튼이 숨겨집니다. |
| `problem` | 상세 화면의 "어떤 문제를 푸나요". 비우면 `description`이 나옵니다. |
| `features` | 상세 화면의 핵심 기능 (3개 권장) |
| `images` | 상세 화면 갤러리에 더 보여 줄 화면들 |
| `accentColor` | 서비스 대표 색. 카드에 마우스를 올리면 번집니다. 어두운 바탕에서 보이는 밝은 색으로 고르세요. |

각 프로젝트는 `https://dku-likelion.vercel.app/#project-<id>` 주소로 바로 공유할 수 있습니다.

## 방문 통계

Vercel Web Analytics(`@vercel/analytics`)가 들어 있습니다. Vercel 프로젝트의 **Analytics** 탭에서 한 번 켜 주면 방문 수와 유입 경로가 집계됩니다.

## 문의 폼

EmailJS를 씁니다. Vercel 프로젝트 설정의 환경변수에 아래 값을 넣어야 실제로 전송됩니다. 값이 없으면 전송하는 척만 합니다.

```
VITE_EMAILJS_PUBLIC_KEY
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_TO_EMAIL
```

## 디자인

- `PRODUCT.md`: 누구를 위한 사이트인지, 지켜야 할 브랜드 약속
- `DESIGN.md`: 색·글꼴·컴포넌트 규칙. 화면을 고치기 전에 읽어 보세요.
- 색은 둘입니다. 오렌지 `#FF6000`(사자, 멋쟁이사자처럼)은 버튼과 링크에, 블루 `#0A559C`(곰, 단국대학교)는 소속 표기에 씁니다. 토큰은 `src/tailwind.css`의 `@theme`에 있습니다.
- 공유 썸네일은 `public/og.png`(1200×630), 파비콘은 `public/favicon.png`입니다.
