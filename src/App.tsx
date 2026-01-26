import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { CurriculumSection } from "./components/CurriculumSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { PeopleSection } from "./components/PeopleSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { PageTransition } from "./components/PageTransition";
import { ScrollToTop } from "./components/ScrollToTop";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProgressBar } from "./components/ProgressBar";
import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <ProgressBar />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <PageTransition>
          <div className="bg-[#1C1C1C] min-h-screen">
            <Navigation />
            <HeroSection />
            <AboutSection />
            <ScheduleSection />
            <CurriculumSection />
            <PeopleSection />
            <ContactSection />
            <Footer />
            <ScrollToTop />
          </div>
        </PageTransition>
      )}
    </>
  );
}