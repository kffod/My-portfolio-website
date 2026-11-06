import AboutSection from "./components/homepage/about";
import Certifications from "./components/homepage/certifications";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import LinkedInPosts from "./components/homepage/linkedin-posts";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";
import Videos from "./components/homepage/videos";
import TerminalSection from "./components/homepage/terminal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TerminalSection />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Education />
      <LinkedInPosts />
      <Videos />
      <ContactSection />
    </>
  )
};
