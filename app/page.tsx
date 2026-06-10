import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectEntryFrame } from '@/components/sections/ProjectEntryFrame';
import { SignalSection } from '@/components/sections/SignalSection';
import { ChapterCard } from '@/components/systems/ChapterCard';
import { FlowPath } from '@/components/systems/FlowPath';
import { MarqueeBand } from '@/components/systems/MarqueeBand';
import { SiteNav } from '@/components/ui/SiteNav';
import { projects } from '@/lib/data/projects';

export default function PortfolioPage() {
  const orderedProjects = projects.sort((a, b) => a.order - b.order);

  return (
    <main id="main-content">
      <FlowPath />
      <SiteNav />
      <HeroSection />
      <MarqueeBand />
      <SignalSection />

      {/*
       * Work section — ChapterCard threshold + entry frames.
       * Architecture E: project detail content lives on dedicated project pages.
       * Each entry frame links to /work/[slug] for the full case study.
       */}
      <section
        id="work"
        aria-label="Selected work"
        style={{ backgroundColor: '#f1ebe1' }}
      >
        <ChapterCard projectTitles={orderedProjects.map(p => p.title)} />
        {orderedProjects.map((project, index) => (
          <ProjectEntryFrame
            key={project.slug}
            headingId={`${project.slug}-heading`}
            index={index}
            title={project.title}
            descriptor={project.descriptor}
            year={project.year}
            tech={project.tech}
            href={`/work/${project.slug}`}
          />
        ))}
      </section>

      <AboutSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
