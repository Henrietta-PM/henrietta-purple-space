import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import cvAsset from "@/assets/henrietta-cv.pdf.asset.json";
import { certifications, education, professionalOverview, selectedWork, skillCategories, timelineNodes } from "@/pages/CV";
import "./cv-app.css";

export default function CvApp({ compact }: { compact: boolean }) {
  return <div className={`cv-document-app ${compact ? "is-phone" : ""}`}>
    <div className="cv-document-toolbar"><FileText aria-hidden="true" /><strong>Curriculum Vitae</strong><Button asChild size="sm" className="cv-download"><a href={cvAsset.url} download="Henrietta_Onwuneme_Product_Manager_CV.pdf"><Download aria-hidden="true" />Download CV</a></Button></div>
    <div className="cv-document-scroll"><article className="cv-document" aria-label="Henrietta Onwuneme CV">
      <header><h1>Henrietta Onwuneme</h1><p>Product Manager</p><a href="mailto:mypvrplespace@gmail.com">mypvrplespace@gmail.com</a><nav aria-label="CV sections">{["Overview", "Experience", "Products", "Education", "Skills"].map((label) => <a key={label} href={`#cv-${label.toLowerCase()}`}>{label}</a>)}</nav></header>
      <section id="cv-overview"><h2>Professional Overview</h2><ul>{professionalOverview.map((line) => <li key={line}>{line}</li>)}</ul></section>
      <section id="cv-experience"><h2>Work Experience</h2><ol className="cv-timeline">{timelineNodes.map((node) => <li key={node.title}><time>{node.dates}</time><h3>{node.url ? <a href={node.url.startsWith("https://") ? node.url : `https://${node.url}`} target="_blank" rel="noopener noreferrer">{node.title}</a> : node.title}</h3><p>{node.role}</p><ul>{node.highlights.map((line) => <li key={line}>{line}</li>)}</ul></li>)}</ol></section>
      <section id="cv-products"><h2>Selected Product Work</h2>{selectedWork.map((work) => <div className="cv-work" key={work.name}><h3>{work.name}</h3><p>{work.line}</p></div>)}</section>
      <section id="cv-education"><h2>Education and Certifications</h2>{education.map((item) => <div className="cv-work" key={item.title}><h3>{item.title}</h3><p>{item.qualification}</p><p className="cv-secondary">{item.dates}</p>{item.description && <p>{item.description}</p>}</div>)}<ul>{certifications.map((line) => <li key={line}>{line}</li>)}</ul></section>
      <section id="cv-skills"><h2>Skills</h2>{[{ title:"Soft Skills", items:skillCategories.softSkills }, { title:"Technical Skills", items:skillCategories.technicalSkills }, { title:"Tools", items:skillCategories.tools }].map((group) => <div className="cv-work" key={group.title}><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></div>)}</section>
    </article></div>
  </div>;
}