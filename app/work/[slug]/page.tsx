import { notFound } from 'next/navigation';

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
    title: project.title,
    description: project.descriptor,
  };
}

/*
 * Project detail page — deep dive case study.
 * Matches the structure in SITE_ARCHITECTURE.md Section 6.
 *
 * This is a placeholder. Full implementation in Phase 4 of the roadmap.
 * The page is statically generated at build time from lib/data/projects.ts.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <div className="scene flex items-center justify-center">
        <div className="text-center">
          <p className="text-label mb-4">{project.year}</p>
          <h1 className="text-heading text-text-primary mb-4">{project.title}</h1>
          <p className="text-body text-text-secondary mb-8">{project.descriptor}</p>
          <p className="text-sm text-text-tertiary">
            Full case study coming soon — Phase 4 of the build roadmap.
          </p>
        </div>
      </div>
    </main>
  );
}
