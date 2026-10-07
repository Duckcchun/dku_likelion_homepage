import memoreal from "../assets/products/memoreal.webp";
import ieum from "../assets/products/ieum.webp";
import firstline from "../assets/products/firstline.webp";
import catchcut from "../assets/products/catchcut.webp";
import orbit from "../assets/products/orbit.webp";
import mowa from "../assets/products/mowa.webp";
import mcmoments from "../assets/products/mcmoments.webp";
import tomo from "../assets/products/tomo.webp";
import banana from "../assets/products/banana.webp";

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
  /** 이미지 크롭 기준점 (CSS object-position) */
  imagePosition?: string;
  /** 링크가 없으면 비워 두세요. 버튼이 자동으로 숨겨집니다. */
  link?: string;
  /** 상세 화면의 '어떤 문제를 푸나요'. 비워 두면 description이 대신 나옵니다. */
  problem?: string;
  /** 상세 화면의 핵심 기능 (3개 권장) */
  features?: string[];
  /** 상세 화면 갤러리에 더 보여 줄 화면들. 대표 이미지(image) 뒤에 이어집니다. */
  images?: string[];
  /** 서비스 대표 색. 카드에 마우스를 올리면 은은하게 번집니다. 어두운 바탕에서 보이는 밝기로 고르세요. */
  accentColor?: string;
}

export interface ProductGroup {
  /** 페이지 내 앵커 id (예: #projects-hackathon) */
  id: string;
  /** 행사 이름 */
  event: string;
  /** 짧은 라벨 (탭·타임라인용) */
  label: string;
  year: number;
  /** 행사 한 줄 설명 */
  summary: string;
  products: Product[];
}

/**
 * 한 해의 진행 순서대로 적어 주세요. (아이디어톤 → 해커톤 → …)
 */
export const productGroups: ProductGroup[] = [
  {
    id: "projects-ideathon",
    event: "멋쟁이사자처럼 대학 아이디어톤",
    label: "아이디어톤",
    year: 2026,
    summary: "문제를 정의하고, 사용자를 만나고, 서비스를 기획·프로토타이핑한 결과물입니다.",
    products: [
      {
        id: "catchcut",
        name: "CATCHCUT",
        tagline: "약관 속 위험 조항을 동의 전에 잡아내는 AI 안전장치",
        description:
          "웹페이지에 계약서·약관·동의서가 나타나면 브라우저 확장이 자동으로 감지해 위험 조항을 신호등 색으로 표시합니다. 어려운 조항은 쉬운 말과 4컷 만화로 풀어 보여 줍니다.",
        category: "Legal · Safety",
        accentColor: "#DB5F51",
        features: [
          "계약서·약관·동의서가 나타나면 브라우저 확장이 자동으로 감지",
          "위험 조항을 신호등 색으로 표시",
          "어려운 조항은 쉬운 말과 4컷 만화로 풀이",
        ],
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
        accentColor: "#6572EB",
        features: [
          "기업이 올린 실무 과제에 맞춰 AI가 맞춤 로드맵과 사전 교육 제공",
          "해커톤 방식으로 과제 수행",
          "담당자 피드백과 결과물이 포트폴리오로 축적",
        ],
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
        accentColor: "#779AF7",
        features: [
          "성적표·생기부·자소서 PDF에서 AI가 역량 추출",
          "무전공·전공자·취준생 상황에 맞춰 이번 주에 할 일까지 안내",
          "쌓인 기록을 이력서로 정리",
        ],
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
        accentColor: "#3D6FE0",
        features: [
          "스크린 타임을 분석해 도파민 유발 앱 찾기",
          "앱을 열 때마다 사용 목적 되묻기",
          "절제에 성공한 시간을 나만의 별자리로 기록",
        ],
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
        accentColor: "#E7C348",
        features: [
          "가장 빛났던 시절의 기억을 이야기로 나누기",
          "AI 자서전 작가가 귀 기울여 듣고 기록",
          "회상치료에서 착안한 대화 방식",
        ],
        image: memoreal,
        imagePosition: "top",
      },
    ],
  },
  {
    id: "projects-hackathon",
    event: "멋쟁이사자처럼 중앙 해커톤",
    label: "중앙 해커톤",
    year: 2026,
    summary: "기획한 서비스를 디자인하고 실제로 동작하는 프로덕트까지 개발한 결과물입니다.",
    products: [
      {
        id: "tomo",
        name: "TOMO",
        tagline: "언어를 넘어 협업의 맥락까지 현지화하는 Gmail AI 에이전트",
        description:
          "해외 파트너에게 보낼 메일을 분석해 문화·관계상 오해가 생길 수 있는 표현을 짚어 주고, 의도는 지키면서 상대에게 맞게 다듬은 문장을 Gmail 본문에 바로 적용합니다.",
        category: "Productivity",
        accentColor: "#DAE465",
        features: [
          "보낼 메일에서 문화·관계상 오해가 생길 수 있는 표현 짚기",
          "의도는 지키면서 상대에게 맞게 문장 다듬기",
          "다듬은 문장을 Gmail 본문에 바로 적용",
        ],
        image: tomo,
        imagePosition: "center 30%",
      },
      {
        id: "mowa",
        name: "MOWA",
        tagline: "걷기를 알아서 감지해 산책을 추억으로 남겨 주는 기록 앱",
        description:
          "식사 후나 귀갓길처럼 의식하지 못한 채 시작된 산책도 걷기를 감지해 기록을 제안합니다. 사진과 짧은 입력만 남기면 AI가 그날의 산책 일기로 정리해 줍니다.",
        category: "Lifestyle",
        accentColor: "#8FB866",
        features: [
          "의식하지 못한 채 시작된 산책도 걷기를 감지해 기록 제안",
          "사진과 짧은 입력만으로 기록 남기기",
          "AI가 그날의 산책 일기로 정리",
        ],
        image: mowa,
        imagePosition: "center",
      },
      {
        id: "banana",
        name: "반나나",
        tagline: "모두의 이동시간과 날씨를 고려해 공평한 만남 장소를 찾아 주는 서비스",
        description:
          "약속방 링크를 공유하면 각자 출발지만 입력하면 됩니다. 실제 이동시간 기준의 중간지점을 찾고, 약속 날 날씨에 맞는 카페·식당·놀거리까지 추천합니다.",
        category: "Local · Social",
        accentColor: "#F1D25B",
        features: [
          "약속방 링크를 공유하고 각자 출발지만 입력",
          "실제 이동시간 기준의 중간지점 찾기",
          "약속 날 날씨에 맞는 카페·식당·놀거리 추천",
        ],
        image: banana,
        imagePosition: "center 32%",
      },
      {
        id: "mcmoments",
        name: "MCMoments",
        tagline: "첫 MCM 구매의 순간을 AI 아트워크로 소장하는 디지털 다이어리",
        description:
          "제품을 등록하고 구매 사연을 남기면 AI가 감정을 분석해 비세토스 패턴을 입힌 나만의 아트워크 보증서를 만듭니다. 소장품은 My Collection에 쌓이고, 어울리는 다음 제품을 제안합니다.",
        category: "Brand · Luxury",
        accentColor: "#B8975A",
        features: [
          "제품을 등록하고 구매 사연 남기기",
          "AI가 감정을 분석해 비세토스 패턴의 아트워크 보증서 생성",
          "My Collection에 소장하고 어울리는 다음 제품 제안",
        ],
        image: mcmoments,
        imagePosition: "center 52%",
      },
    ],
  },
];

export const allProducts = productGroups.flatMap((g) => g.products);
