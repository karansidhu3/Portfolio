import { notFound } from 'next/navigation';

import { ProjectScene } from '@/components/sections/ProjectScene';
import { SiteNav } from '@/components/ui/SiteNav';
import { projects } from '@/lib/data/projects';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} — Karan Sidhu`,
    description: project.descriptor,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <SiteNav />
      <ProjectScene project={project} index={project.order - 1} />
    </main>
  );
}
