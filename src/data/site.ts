import member1 from "../assets/member-1.webp";
import member2 from "../assets/member-2.webp";
import member3 from "../assets/member-3.webp";
import member4 from "../assets/member-4.webp";
import member5 from "../assets/member-5.webp";
import member6 from "../assets/member-6.webp";
import member7 from "../assets/member-7.webp";
import member8 from "../assets/member-8.webp";

export const generation = 14;

/* ───────── 트랙 ───────── */
export interface Track {
  id: string;
  title: string;
  ko: string;
  description: string;
  tools: string[];
  curriculum: string[];
}

export const tracks: Track[] = [
  {
    id: "pm",
    title: "PM",
    ko: "기획",
    description: "문제를 정의하고, 사용자를 이해하고, 팀이 같은 방향을 보게 만듭니다.",
    tools: ["Notion", "Jira", "User Research", "Data Analysis", "MVP Strategy", "Agile"],
    curriculum: [
      "프로덕트 매니지먼트 기초",
      "사용자 니즈 분석",
      "기획서 작성 및 문서화",
      "애자일 방법론",
      "데이터 기반 의사결정",
      "팀 커뮤니케이션 스킬",
    ],
  },
  {
    id: "design",
    title: "Design",
    ko: "디자인",
    description: "사용자 경험을 설계하고, 생각을 눈에 보이는 화면으로 바꿉니다.",
    tools: ["Figma", "Prototyping", "UI/UX", "Illustration", "Design System"],
    curriculum: [
      "디자인 씽킹 프로세스",
      "사용자 리서치 방법론",
      "와이어프레임 & 프로토타입",
      "UI/UX 디자인 원칙",
      "디자인 시스템 구축",
      "개발자와의 협업",
    ],
  },
  {
    id: "frontend",
    title: "Front-end",
    ko: "프론트엔드",
    description: "사용자가 직접 마주하는 웹과 앱 화면을 만듭니다.",
    tools: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
    curriculum: [
      "웹 기초 (HTML, CSS, JavaScript)",
      "React 핵심 개념 및 Hook",
      "상태 관리 (Zustand, Redux)",
      "Next.js 프레임워크",
      "TypeScript 도입",
      "반응형 디자인 & 최적화",
    ],
  },
  {
    id: "backend",
    title: "Back-end",
    ko: "백엔드",
    description: "서버, 데이터베이스, API를 설계하고 서비스를 세상에 배포합니다.",
    tools: ["Node.js", "Express", "Django", "Spring", "PostgreSQL", "MongoDB"],
    curriculum: [
      "서버와 API 개념",
      "RESTful API 설계",
      "데이터베이스 설계 및 쿼리",
      "인증/인가 시스템",
      "배포 및 클라우드 (AWS, Docker)",
      "성능 최적화 및 보안",
    ],
  },
];

/* ───────── 1년의 흐름 ───────── */
export interface Milestone {
  title: string;
  /** 비워 두면 날짜 없이 표시됩니다. */
  date?: string;
  description: string;
  /** 결과물이 있는 행사라면 productGroups의 id */
  projectsAnchor?: string;
}

export const milestones: Milestone[] = [
  { title: "아기사자 모집", date: "2월 – 3월", description: `${generation}기 아기사자 모집과 면접` },
  { title: "OT", date: "3월 18일", description: "합격 발표 후 전체 오리엔테이션" },
  { title: "정기 세션", date: "3월 – 6월", description: "트랙별 정기 세션과 스터디" },
  {
    title: "아이디어톤",
    date: "4월 30일 – 6월 1일",
    description: "문제 정의부터 기획·프로토타입까지",
    projectsAnchor: "projects-ideathon",
  },
  {
    title: "중앙 해커톤",
    date: "7월",
    description: "기획한 서비스를 실제로 개발",
    projectsAnchor: "projects-hackathon",
  },
  { title: "최종 데모데이", date: "11월", description: "한 해의 결과물 발표와 시연" },
];

/* ───────── 운영진 ───────── */
export interface Member {
  name: string;
  role: string;
  message: string;
  image: string;
  email?: string;
  github?: string;
  linkedin?: string;
}

export const members: Member[] = [
  {
    name: "손동민",
    role: `${generation}기 대표`,
    message: "함께 성장하는 대표가 되겠습니다!",
    image: member1,
    email: "qasw1733@gmail.com",
    github: "https://github.com/Duckcchun",
    linkedin: "https://www.linkedin.com/in/%EB%8F%99%EB%AF%BC-%EC%86%90-0a5674354",
  },
  {
    name: "여채린",
    role: `${generation}기 부대표`,
    message: "함께 배우고 성장하는 멋사를 만들어가겠습니다.",
    image: member2,
    email: "ycl0514@dankook.ac.kr",
    github: "https://github.com/chae-ring",
  },
  {
    name: "양준호",
    role: "백엔드",
    message: "올해도 버텨보겠습니다. 같이 성장해요!",
    image: member3,
    email: "did1406dud@dankook.ac.kr",
    github: "https://github.com/Novice-Dev-Robin",
  },
  {
    name: "김민수",
    role: "백엔드",
    message: "함께 성장해나가며 모두에게 얻어갈 수 있는 한 해가 되어봅시다!",
    image: member4,
    email: "ms32220624@dankook.ac.kr",
    github: "https://github.com/Minwater-03",
  },
  {
    name: "김선민",
    role: "프론트엔드",
    message: "꾸준한 노력으로 성장하는 개발자입니다.",
    image: member5,
    email: "kimsunmin0616@dankook.ac.kr",
  },
  {
    name: "이효빈",
    role: "프론트엔드",
    message: "오늘도 심어보는 사과나무 한 그루, 잘 부탁드립니다~",
    image: member6,
    email: "hbeen22@dankook.ac.kr",
    github: "https://github.com/hyoddi",
  },
  {
    name: "이동근",
    role: "기획",
    message: "함께 소통하고 완성도 높은 서비스를 만들겠습니다!",
    image: member7,
  },
  {
    name: "김지호",
    role: "디자인",
    message: "더 나은 사용자 경험을 위해 디테일을 놓치지 않겠습니다!",
    image: member8,
  },
];

/* ───────── 모집·연락처 ───────── */
export const recruit = {
  /** 모집 기간이면 true로 바꾸고 applyUrl을 확인하세요. */
  isOpen: false,
  applyUrl: "https://dku-lion.vercel.app/",
  schedule: [
    { phase: "서류 접수", period: "2026.02.01 – 03.10" },
    { phase: "면접", period: "2026.03.12 – 03.13" },
    { phase: "최종 합격 발표", period: "2026.03.15" },
    { phase: "OT 및 활동 시작", period: "2026.03.18" },
  ],
};

export const contact = {
  email: "dku_uni@likelion.org",
  instagram: { handle: "@likelion.dku", url: "https://www.instagram.com/likelion.dku/" },
  github: "https://github.com/Duckcchun",
  address: "경기도 용인시 수지구 죽전로 152 단국대학교",
};
