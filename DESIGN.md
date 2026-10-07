---
name: 멋쟁이사자처럼 단국대학교
description: 사자와 곰이 함께 쓰는 밤샘 작업실. 어두운 방에서 화면 속 결과물만 밝다.
colors:
  lion-orange: "#FF6000"
  lion-orange-hover: "#FF7420"
  bear-blue: "#0A559C"
  bear-blue-light: "#7DB3EA"
  dawn-black: "#0B0B0B"
  desk-black: "#0F0F0F"
  monitor-off: "#161616"
  overlay-black: "#0A0A0A"
  paper-white: "#FFFFFF"
  success: "#34D399"
  error: "#F87171"
typography:
  display:
    fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Apple SD Gothic Neo, Noto Sans KR, sans-serif"
    fontSize: "clamp(2.35rem, 6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Pretendard Variable, Pretendard, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  gutter: "20px"
  gutter-wide: "32px"
  card: "28px"
  card-wide: "36px"
  header-gap: "56px"
  section: "112px"
  section-wide: "144px"
components:
  button-primary:
    backgroundColor: "{colors.lion-orange}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.xl}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.lion-orange-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.xl}"
    padding: "14px 28px"
  button-light:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.dawn-black}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-light-hover:
    backgroundColor: "{colors.lion-orange}"
    textColor: "{colors.paper-white}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  input:
    backgroundColor: "{colors.monitor-off}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  panel-bear:
    backgroundColor: "{colors.bear-blue}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.2xl}"
    padding: "48px"
  card-recruit:
    backgroundColor: "{colors.monitor-off}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.2xl}"
    padding: "32px"
---

# Design System: 멋쟁이사자처럼 단국대학교

## Overview

**Creative North Star: "밤샘 작업실"**

해커톤 새벽의 어두운 방이다. 불은 꺼져 있고 모니터만 켜져 있다. 바탕은 거의 검정에 가깝게 가라앉고, 밝은 것은 팀이 만든 서비스 화면과 운영진의 얼굴뿐이다. 장식이 아니라 결과물이 조명 역할을 한다.

분위기는 **친근하고 정돈되어 있다.** 대학생 동아리답게 편하게 말을 걸되("~합니다" 문체, 운영진의 한마디), 간격과 정렬은 흐트러지지 않는다. 버튼·카드·입력창은 **부드럽고 편안하다**: 둥근 모서리, 넉넉한 터치 영역, 그림자 없는 조용한 면.

이 방에는 두 주인이 있다. **사자**(멋쟁이사자처럼)와 **곰**(단국대학교). 대학 엠블럼이 이미 답을 가지고 있다: 사자의 갈기를 쓴 곰. 색도 그 둘에게서 온다. 오렌지는 사자, 블루는 곰이다.

이 시스템이 거부하는 모습은 두 가지다. 보라·파랑 그라데이션과 글래스 카드, 네온 글로우가 뒤섞인 **AI 템플릿 랜딩 페이지**, 그리고 표와 공지글 위주의 **학교 공지 게시판**.

**Key Characteristics:**
- 어두운 바탕 위에 실제 결과물 이미지가 유일한 광원이다
- 색은 둘뿐이다: 사자 오렌지(행동)와 곰 블루(소속)
- 그림자 없이 면의 밝기 차이와 1px 선으로 층을 나눈다
- 01–06 번호가 붙은 섹션 머리말이 페이지를 하나의 이야기로 잇는다
- 한 번만 떠오르는 조용한 등장 모션

## Colors

검정 세 단계 위에 브랜드 색 두 개. 색이 드물어서 색이 보이는 곳이 곧 의미가 된다.

### Primary
- **사자 오렌지** (`lion-orange`): 멋쟁이사자처럼의 색. 누를 수 있는 것과 강조에만 쓴다. 주 버튼, 텍스트 링크, 섹션 번호, 타임라인에서 결과물이 있는 행사, 포커스 링, 텍스트 선택 색.
- **사자 오렌지 호버** (`lion-orange-hover`): 주 버튼의 호버 상태 전용.

### Secondary
- **곰 블루** (`bear-blue`): 단국대학교 블루(Pantone 661C). 면으로만 쓴다. 소개 섹션의 엠블럼 패널이 유일한 큰 블루 면이다.
- **곰 블루 라이트** (`bear-blue-light`): 어두운 바탕 위의 블루 글자용. 히어로와 내비·푸터의 `DANKOOK UNIV.`/`DKU`, 운영진 역할, 캠퍼스 주소 아이콘.

### Neutral
- **새벽 검정** (`dawn-black`): 기본 바탕. 히어로, 소개, 1년의 흐름, 사람들, 푸터.
- **책상 검정** (`desk-black`): 교차 바탕. 트랙, 프로젝트, 함께하기. 섹션이 바뀌었음을 아주 조용히 알린다.
- **꺼진 모니터** (`monitor-off`): 올라온 면. 이미지 자리, 입력창, 모집 카드.
- **오버레이 검정** (`overlay-black`): 라이트박스 배경(95% 불투명).
- **종이 흰색** (`paper-white`): 글자. 불투명도로 위계를 만든다: 제목 100%, 본문 55–60%, 보조·번호·플레이스홀더 50%. 50% 아래로는 글자에 쓰지 않는다(대비 4.5:1 미달). 선은 6–10%, 링은 10–20%.
- **성공 / 오류** (`success`, `error`): 문의 폼의 상태 메시지와 모집 중 표시에만.

### Named Rules
**서비스 대표 색은 그 서비스 안에서만.** 프로젝트마다 가진 `accentColor`는 그 카드의 호버와 상세 화면의 점·번호에만 쓴다. 사이트의 색은 여전히 오렌지와 블루 둘이다.

**사자는 행동, 곰은 소속.** 오렌지는 "여기를 누르세요"와 "이것이 결과물입니다"를 말한다. 블루는 "우리는 단국대학교에 있습니다"를 말한다. 블루 버튼이나 오렌지 소속 표기는 만들지 않는다.

**곰 블루는 글자가 되지 않는다.** `bear-blue` 원색은 검정 바탕에서 대비가 부족하다. 글자와 아이콘에는 반드시 `bear-blue-light`를 쓴다.

**블루 면은 한 화면에 하나.** 엠블럼 패널이 귀한 이유는 하나뿐이기 때문이다.

## Typography

**Display / Body Font:** Pretendard Variable (대체: Apple SD Gothic Neo, Noto Sans KR, system-ui)

**Character:** 한 서체로 굵기와 크기만 바꿔 쓴다. 제목은 굵고 촘촘하게 당기고, 본문은 가늘고 넉넉하게 푼다. `word-break: keep-all`로 한국어 단어가 중간에 끊기지 않는다.

### Hierarchy
- **Display** (700, 2.35rem → 5.5rem, 1.1, -0.03em): 히어로 제목 한 곳에만.
- **Headline** (700, 2.25rem → 3.5rem, 1.15, -0.02em): 섹션 제목. 두 줄로 끊어 쓴다.
- **Title** (700, 1.25–1.75rem): 카드·트랙·프로젝트·운영진 이름, 엠블럼 패널 제목.
- **Body** (400, 15px, 1.625): 설명문. 최대 폭 약 28rem(`max-w-md`)에서 끊는다. 세부 목록은 14px.
- **Label** (500, 14px): 섹션 번호와 라벨, 날짜, 역할, 메타 정보. 숫자는 `tabular-nums`.
- **Kicker** (600, 12–14px, 0.24em, 대문자): 히어로의 `LIKELION · DANKOOK UNIV.` 한 곳. 프로젝트 분야 태그는 0.14em.

### Named Rules
**굵기는 둘.** 제목은 700, 본문은 400. 그 사이(500·600)는 라벨과 버튼에만 쓴다.

## Layout

최대 폭 80rem(`max-w-7xl`) 컨테이너에 좌우 여백 20px(모바일) / 32px(640px 이상). 섹션은 위아래 112px / 144px로 넉넉히 떨어지고, 섹션 머리말 아래는 56px / 80px.

모든 섹션은 같은 머리말로 시작한다: 번호와 라벨 → 큰 제목(왼쪽) → 설명(데스크톱에서는 오른쪽 아래 정렬). 페이지 순서는 소개 → 트랙 → 1년의 흐름 → 프로젝트 → 사람들 → 함께하기로 고정이며, 번호가 그 순서를 싣는다.

그리드는 내용에 따라 달라진다. 가치 3열과 트랙 4열은 **1px 틈 그리드**(틈 사이로 흰색 8% 바탕이 비쳐 선이 된다), 프로젝트는 6열 위에서 개수에 따라 절반/3분의 1 폭, 운영진은 2열 → 4열, 타임라인은 모바일 세로선 → 데스크톱 6열 가로선.

768px 미만에서는 내비게이션이 전체 화면 메뉴로 바뀌고, 히어로 버튼은 세로로 쌓여 전체 폭을 쓴다.

## Elevation & Depth

**그림자가 없다.** 깊이는 세 가지로만 만든다: 검정의 단계(`dawn-black` → `desk-black` → `monitor-off`), 안쪽 1px 링(흰색 6–20%), 그리고 스크롤된 내비게이션과 맨 위로 버튼의 배경 흐림.

히어로에만 분위기 장치가 있다. 사자의 오렌지 빛과 곰의 블루 빛이 화면 양쪽 모서리에서 번지고, 그 위에 설계도 같은 옅은 격자가 깔린다. 스크롤하면 격자는 사라지고 두 빛은 정렬된 프로덕트 줄 아래로 모인다. 다른 섹션으로는 번지지 않는다.

### Named Rules
**빛은 화면에서만 나온다.** 글로우, 네온 테두리, 색 그림자를 새로 만들지 않는다. 밝아야 할 것은 결과물 이미지다.

## Shapes

모서리는 모두 둥글고, 크기에 따라 네 단계다. 입력창과 작은 버튼은 8px, 히어로 버튼과 이미지 틀은 12px, 큰 패널과 그리드 묶음은 16px, 칩과 아이콘 버튼과 타임라인 점은 완전한 원.

선은 항상 1px이고 흰색의 낮은 불투명도다. 색 있는 굵은 테두리는 없다. 이미지는 틀에 맞춰 잘리며(`object-cover`), 프로젝트는 16:10 또는 4:3, 운영진은 4:5.

## Components

### Buttons
- **성격:** 누르기 편하고 조용하다. 모바일에서는 전체 폭.
- **주 버튼:** 사자 오렌지 면에 흰 글자(600), 12px 모서리, 14px × 28px. 호버 시 밝은 오렌지, 누르면 0.98배로 살짝 눌린다.
- **외곽 버튼:** 투명 바탕에 흰색 20% 안쪽 링. 호버 시 흰색 5% 면.
- **밝은 버튼:** 흰 면에 검은 글자, 8px 모서리(내비 CTA, 문의 보내기). 호버 시 오렌지로 뒤집힌다.
- **텍스트 링크:** 오렌지 600 글자에 화살표 아이콘, 호버 시 밑줄(간격 4px).
- **아이콘 버튼:** 32–40px 원, 흰색 10% 링, 호버 시 흰 면에 검은 아이콘.

### Chips
- **스타일:** 완전한 원형, 투명 바탕에 흰색 15% 링, 14px 500. 개수는 흰색 40%의 `tabular-nums`.
- **상태:** 호버 시 흰 면에 검은 글자. 프로젝트 섹션의 행사 바로가기에 쓴다.

### Cards / Containers
- **틈 그리드 칸:** 바탕색 면에 28–36px 안쪽 여백. 테두리 대신 1px 틈이 선이 된다. 묶음 전체가 16px로 둥글다.
- **모집 카드:** 꺼진 모니터 면, 16px 모서리, 흰색 6% 링, 28–32px 여백. 상태 점(모집 중: 초록 / 아닐 때: 흰색 30%).
- **이미지 틀:** 꺼진 모니터 면, 12px 모서리. 프로젝트 카드는 호버 시 링이 그 서비스의 대표 색(`accentColor`)으로 바뀌고 같은 색이 틀 아래로 은은하게 번지며, 이미지가 1.03배로 커진다. 카드 전체가 상세 화면으로 가는 링크다.

### Inputs / Fields
- **스타일:** 꺼진 모니터 면, 8px 모서리, 흰색 10% 안쪽 링, 12px × 16px. 라벨은 위에 14px 흰색 60%.
- **포커스:** 2px 오렌지 링.
- **상태:** 전송 중에는 비활성. 결과는 폼 아래 아이콘과 함께 초록/빨강 한 줄.

### Navigation
- **스타일:** 64px 고정 바. 맨 위에서는 투명, 스크롤하면 새벽 검정 85%와 배경 흐림, 아래 1px 선.
- **워드마크:** 32px 엠블럼 + `LIKELION`(흰색 700) `DKU`(곰 블루 라이트 500).
- **링크:** 15px 흰색 60%, 호버 시 100%.
- **모바일:** 전체 화면 메뉴, 24px 600 글자가 1px 선으로 나뉜다.

### 엠블럼 패널 (Signature)
곰 블루 전체 면 위에 대학 엠블럼을 올린 패널. 엠블럼의 바깥 파란 고리가 패널 색에 녹아들어 흰 선과 사자·곰의 얼굴만 남는다. 16px 모서리, 28–48px 여백. 왼쪽에 제목과 두 문장, 사자(오렌지 점)와 곰(흰 점) 범례. 데스크톱에서는 엠블럼이 오른쪽 256px, 모바일에서는 위쪽 144px. 페이지에 한 번만 나온다.

### 프로젝트 상세
카드를 누르면 열리는 전체 화면 뷰(오버레이 검정 95%). 왼쪽에 화면 갤러리, 오른쪽에 분야 → 이름 → 한 줄 소개 → 설명 → 핵심 기능(번호는 서비스 대표 색) → 서비스 링크(주 버튼). 모바일은 한 열로 쌓인다. 주소가 `#project-<id>`로 바뀌어 그대로 공유할 수 있고, Esc·바깥 클릭·뒤로 가기로 닫힌다.

### 타임라인
15px 원 점이 1px 선 위에 놓인다. 일반 행사는 흰색 40% 테두리의 빈 점, 결과물이 있는 행사는 오렌지로 채운 점과 오렌지 제목, 그리고 해당 프로젝트로 가는 밑줄 링크.

### 모션
모든 등장은 같은 곡선(`cubic-bezier(0.22, 1, 0.36, 1)`)으로 20px 아래에서 한 번만 떠오른다(0.5–0.7초, 항목 간 0.05–0.06초 간격). 페이지에서 연출된 순간은 히어로 하나다: 프로덕트 화면 9장이 가장자리에 기울어진 채 흩어져 천천히 떠 있다가, 스크롤에 맞춰 화면 아래 한 줄로 정렬된다("아이디어 → 서비스"). 히어로는 190svh 높이에 100svh 고정 화면으로 이 구간을 만든다. `prefers-reduced-motion`에서는 처음부터 정렬된 모습으로 고정되고 떠 있는 움직임도 멈춘다.

## Do's and Don'ts

### Do:
- **Do** 오렌지는 누를 수 있는 것과 결과물 강조에만, 블루는 단국대학교 소속 표기에만 쓴다.
- **Do** 어두운 바탕의 블루 글자는 `bear-blue-light`로 쓴다.
- **Do** 새 섹션은 `SectionHeader`로 시작하고, 바탕은 새벽 검정과 책상 검정을 번갈아 쓴다.
- **Do** 층은 검정의 단계와 1px 흰색 링으로 나눈다.
- **Do** 모서리는 8 / 12 / 16px / 원 네 단계 안에서 고른다.
- **Do** 엠블럼은 원본 그대로 쓴다. 자르거나 색을 바꾸지 않는다.
- **Do** 새 색은 `src/tailwind.css`의 `@theme`에 토큰으로 먼저 추가한다.

### Don't:
- **Don't** 보라·파랑 그라데이션, 글래스 카드, 네온 글로우를 쓰지 않는다. AI 템플릿처럼 보인다.
- **Don't** 표와 공지글 목록으로 화면을 채우지 않는다. 학교 공지 게시판처럼 보인다.
- **Don't** 그림자나 색 번짐을 히어로 밖에 추가하지 않는다. 히어로의 빛도 오렌지와 블루 둘뿐이다.
- **Don't** `bear-blue` 원색을 검정 바탕의 글자·아이콘에 쓰지 않는다.
- **Don't** 블루 면을 한 화면에 둘 이상 두지 않는다.
- **Don't** 세 번째 브랜드 색을 들이지 않는다.
- **Don't** 데이터에 없는 수치나 성과를 화면에 올리지 않는다.
