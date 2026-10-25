import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/data/projects';

export default function MuseumGallery({ project, onReturn, reduced }: { project: Project; onReturn: () => void; reduced: boolean }) {
  const sections = [
    { title: 'What it is', paragraphs: [project.overview] },
    { title: 'The problem', paragraphs: project.problem ? [project.problem] : [] },
    { title: 'What I did', paragraphs: project.whatIDid ? [project.whatIDid] : project.responsibilities || [] },
    { title: 'The strategy', paragraphs: project.strategy || [] },
    { title: 'Outcome', paragraphs: project.outcome || project.achievements || [] },
    { title: 'Stack and tools', paragraphs: project.stack ? [project.stack] : [] },
  ].filter((section) => section.paragraphs.length > 0);
  return <motion.section className="museum-gallery" initial={{ opacity: 0, y: reduced ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.6 }} aria-label={`${project.name} gallery`}>
    <div className="museum-gallery-heading"><Button variant="ghost" onClick={onReturn}><ArrowLeft /> Grounds</Button><span>THE COLLECTION / {project.tags.join(' · ')}</span></div>
    <div className="museum-gallery-content"><div><h2>{project.name}</h2><img src={project.image} alt={`${project.name} product preview`} className="museum-gallery-image" />{project.link !== '#' && <Button variant="default" asChild><a href={project.link} target="_blank" rel="noopener noreferrer">Open product <ArrowUpRight /></a></Button>}</div><div className="museum-gallery-text">{sections.map((section) => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div></div>
  </motion.section>;
}
