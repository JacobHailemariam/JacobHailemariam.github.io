import SectionShell from "@/components/layout/SectionShell";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import { featuredProject, projects } from "@/lib/site-content";

/**
 * Section order matters more than anything else on this page. The research
 * comes first at full width. Everything after it sits in a two-column grid of
 * cards (one column on phones), with the wearable arm first. Each card keeps
 * its problem / decision / impact inside a "Read more" drawer.
 */
export default function ProjectsSection() {
  return (
    <SectionShell
      id="work"
      index={1}
      heading="Work"
      deck="Each project is laid out the same way: the problem, the decision I made, and what came of it. Numbers are measured, not estimated."
    >
      <FeaturedProject project={featuredProject} />

      <div className="mt-20 grid grid-cols-1 gap-6 sm:mt-24 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionShell>
  );
}
