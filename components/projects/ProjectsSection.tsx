import SectionShell from "@/components/layout/SectionShell";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import { featuredProject, projects } from "@/lib/site-content";

/**
 * Section order matters more than anything else on this page. The research
 * comes first at full width, and everything after it is a card — so the
 * hierarchy is legible in the first two seconds of scrolling, before any
 * reading happens.
 */
export default function ProjectsSection() {
  return (
    <SectionShell
      id="work"
      heading="Work"
      deck="Research, backend systems, a venture, and a board I routed myself. Numbers below are measured, not estimated."
    >
      <FeaturedProject project={featuredProject} />

      <div className="mt-24 space-y-20 sm:mt-32 sm:space-y-24">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionShell>
  );
}
