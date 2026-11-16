import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { featuredProject, projects } from "@/lib/site-content";

/** Every project in home-page order: the research project first. */
const allProjects = [featuredProject, ...projects];

/** Static export: one page per project, written at build time. */
export async function generateStaticParams() {
  return allProjects.map((project) => ({ id: project.id }));
}

export const dynamicParams = false;

type PageProps = { params: { id: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const project = allProjects.find((item) => item.id === params.id);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default function ProjectPage({ params }: PageProps) {
  const index = allProjects.findIndex((item) => item.id === params.id);
  if (index === -1) notFound();

  return (
    <ProjectDetail
      project={allProjects[index]}
      number={String(index + 1).padStart(2, "0")}
      previous={allProjects[index - 1] ?? null}
      next={allProjects[index + 1] ?? null}
    />
  );
}
