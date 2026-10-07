import memoreal from "../assets/products/memoreal.webp";
import ieum from "../assets/products/ieum.webp";
import firstline from "../assets/products/firstline.webp";
import catchcut from "../assets/products/catchcut.webp";
import orbit from "../assets/products/orbit.webp";

export interface Product {
  id: string;
  name: string;
  /** 카드 제목 아래 한 줄 소개 */
  tagline: string;
  /** 2~3문장 설명 */
  description: string;
  /** 분야 태그 */
  category: string;
  image: string;
  /** 이미지 크롭 기준점 (object-position) */
  imagePosition?: string;
  /** 링크가 없으면 비워 두세요. 버튼이 자동으로 숨겨집니다. */
  link?: string;
}

export interface ProductGroup {
  /** 예: "2026 멋사대학 아이디어톤" */
  event: string;
  year: number;
  products: Product[];
}

/**
 * 새 행사 결과물이 생기면 이 배열 맨 앞에 그룹을 하나 추가하면 됩니다.
 */
export const productGroups: ProductGroup[] = [
  {
    event: "멋사대학 아이디어톤",
    year: 2026,
    products: [
      {
        id: "catchcut",
        name: "CATCHCUT",
        tagline: "약관 속 위험 조항을 동의 전에 잡아내는 AI 안전장치",
        description:
          "웹페이지에 계약서·약관·동의서가 나타나면 브라우저 확장이 자동으로 감지해 위험 조항을 신호등 색으로 표시합니다. 어려운 조항은 쉬운 말과 4컷 만화로 풀어 보여 줍니다.",
        category: "Legal · Safety",
        image: catchcut,
        imagePosition: "center",
        link: "https://chae-ring.github.io/catchcut-prototype/",
      },
      {
        id: "firstline",
        name: "첫, 줄",
        tagline: "기업의 실무 과제로 청년의 첫 경력을 만드는 AI 실무 중개 플랫폼",
        description:
          "기업이 실무 과제를 올리면 AI가 청년에게 맞춤 로드맵과 사전 교육을 제공하고, 청년은 해커톤 방식으로 과제를 수행합니다. 담당자 피드백과 결과물은 포트폴리오로 쌓입니다.",
        category: "Career",
        image: firstline,
        imagePosition: "top",
        link: "https://ai-linkedin-inky.vercel.app/",
      },
      {
        id: "ieum",
        name: "이음",
        tagline: "내 서류를 AI가 읽고 그려 주는 초개인화 커리어 로드맵",
        description:
          "성적표·생기부·자소서 PDF를 올리면 AI가 역량을 추출하고, 무전공·전공자·취준생 상황에 맞춰 이번 주에 할 일까지 안내합니다. 쌓인 기록은 이력서로 정리됩니다.",
        category: "Career",
        image: ieum,
        imagePosition: "top",
        link: "https://amused-spray-27748457.figma.site/",
      },
      {
        id: "orbit",
        name: "Orbit",
        tagline: "차단 대신 “왜 켰나요?”를 묻는 AI 도파민 디톡스",
        description:
          "스크린 타임을 분석해 도파민 유발 앱을 찾고, 앱을 열 때마다 사용 목적을 되묻습니다. 절제에 성공한 시간은 나만의 별자리로 기록됩니다.",
        category: "Wellbeing",
        image: orbit,
        imagePosition: "top",
      },
      {
        id: "memoreal",
        name: "Memoreal",
        tagline: "AI 자서전 작가와 나누는 인생 이야기, 시니어 외로움 솔루션",
        description:
          "어르신이 가장 빛났던 시절의 기억을 이야기하면 AI 자서전 작가가 귀 기울여 듣고 기록합니다. 회상치료에서 착안해, AI에 대한 거부감 없이 외로움을 덜어 드립니다.",
        category: "Senior · Wellbeing",
        image: memoreal,
        imagePosition: "top",
      },
    ],
  },
];
