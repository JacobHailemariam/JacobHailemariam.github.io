import HeroSection from "@/components/hero/HeroSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ExperienceSection from "@/components/experience/ExperienceSection";
import SkillsSection from "@/components/skills/SkillsSection";
import AboutSection from "@/components/about/AboutSection";
import ContactSection from "@/components/contact/ContactSection";

/**
 * ORDERING
 *
 * Work comes before About, so projects and results are the first thing a
 * visitor sees.
 *
 * Skills sits between Experience and About as the bridge — it's the section
 * that makes the electrical/embedded half impossible to overlook, right after
 * the timeline has established where each half was practised.
 *
 * This is a fully static page. Every section except the hero and header is a
 * Server Component with no client JavaScript at all, so the only JS that ships
 * is the hero canvas, the scroll spy, and the reveal wrappers.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
