import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { TracksSection } from "./components/TracksSection";
import { JourneySection } from "./components/JourneySection";
import { ProjectsSection } from "./components/ProjectsSection";
import { PeopleSection } from "./components/PeopleSection";
import { JoinSection } from "./components/JoinSection";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

/**
 * 페이지 흐름: 소개 → 배우는 것(트랙) → 1년의 흐름 → 만든 것(프로젝트) → 사람 → 함께하기
 * 프로젝트가 갑자기 튀어나오지 않도록, '어떻게 배우고 어떤 행사를 거쳐 만들었는지'를
 * 먼저 보여 준 뒤 결과물로 이어집니다.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#0B0B0B]"
      >
        본문으로 건너뛰기
      </a>
      <Navigation />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <AboutSection />
        <TracksSection />
        <JourneySection />
        <ProjectsSection />
        <PeopleSection />
        <JoinSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
