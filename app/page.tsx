import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectScene } from '@/components/sections/ProjectScene';
import { SignalSection } from '@/components/sections/SignalSection';
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

      {orderedProjects.map((project, index) => (
        <ProjectScene key={project.slug} project={project} index={index} />
      ))}

      <AboutSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
