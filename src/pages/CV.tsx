import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import portraitImage from "@/assets/henrietta-portrait.jpg";

const timelineNodes = [
  {
    title: "ProxyMedicine",
    role: "Team Lead / Product Manager",
    dates: "Feb 2025 – Current",
    highlights: [
      "Led development of AI-powered telehealth platform, increasing patient satisfaction by 60%",
      "Facilitated product roadmap with defined milestones, resulting in 25% faster time to market",
      "Conducted 5 user interviews per week to inform product decisions",
    ],
  },
  {
    title: "Bloomie",
    role: "Product Manager",
    dates: "Nov 2024 – May 2025",
    highlights: [
      "Delivered Bloomie AI MVP core features, adopted by 80% of users daily",
      "Created detailed PRDs and user flows, accelerating development speed by 20%",
      "Drove data-informed product enhancements through A/B testing, boosting retention by 45%",
    ],
  },
  {
    title: "Qwikdrip",
    role: "Product Manager",
    dates: "May 2024 – Dec 2024",
    highlights: [
      "Incorporated insights from 20+ user interviews to guide feature prioritization",
      "Developed PRDs and wireframes, reducing development time by 15%",
      "Optimized features through continuous testing, boosting user content generation by 20%",
    ],
  },
  {
    title: "Umbaji",
    role: "Project Manager",
    dates: "May 2023 – Feb 2024",
    highlights: [
      "Spearheaded 15+ project kick-off meetings, reducing project delays by 2 weeks",
      "Managed cross-functional team, achieving 84% average efficiency rate",
      "Championed team alignment, increasing developer contributions by 31%",
    ],
  },
  {
    title: "Syncu",
    role: "Team Lead / Product Manager",
    dates: "Jan 2024 – Current",
    highlights: [
      "Scaled Syncu community to 250+ members",
      "Facilitated 10+ successful product collaborations",
      "Acquired 530+ users to waitlist through community-driven marketing",
    ],
  },
  {
    title: "CareerPASS",
    role: "Team Lead / Product Manager",
    dates: "Mar 2024 – Apr 2024",
    highlights: [
      "Led end-to-end development of CareerPASS psychometric platform",
      "Integrated user feedback to enhance assessment algorithm precision",
      "Recognized as top 5 project",
    ],
  },
  {
    title: "University of Uyo",
    role: "BSc Architecture",
    dates: "Jul 2018 – Jul 2024",
    highlights: ["Strong foundation in human-centered design"],
  },
];

const skillCategories = {
  softSkills: [
    "Team Leadership",
    "Data-driven Decisions",
    "Strategic Thinking",
    "Communication",
    "Problem Solving",
    "Creative Eyesight",
  ],
  technicalSkills: [
    "Product Roadmaps",
    "PRDs & User Stories",
    "UX Research",
    "A/B Testing",
    "Analytics",
    "User Journey",
    "Product-Led Growth",
    "Feature Prioritization",
    "MVP Development",
    "API Documentation",
    "Data Analytics",
    "Agile Frameworks",
    "Scrum Methodologies",
  ],
  tools: [
    "Figma",
    "Google Analytics",
    "Jira",
    "Trello",
    "Notion",
    "Miro",
    "Amplitude",
    "ChatGPT",
    "CursorAI",
    "GitHub",
    "Whimsical",
  ],
};

const CV = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />
      <main className="pt-40 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <img 
                src={portraitImage} 
                alt="Henrietta Onwuneme" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-primary/20"
              />
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-2">
                  Curriculum <span className="font-handwritten text-primary-visible">Vitae</span>
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  My journey through product management and beyond
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="gap-2 w-full md:w-auto">
              <a href="https://calendar.app.google/aKsp6pywYzCAS6Nr9" target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5" />
                Hire Henrietta
              </a>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="glass p-8 rounded-[1.5rem]">
              <h2 className="text-3xl font-display font-bold mb-4">Professional Summary</h2>
              <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
                <li>Product Manager with 2+ years of experience launching AI-driven products and scaling user communities</li>
                <li>Led cross-functional teams across 5+ product lines, including telehealth, AI, SaaS, and personalized learning platforms</li>
                <li>Decreased product development delays by 15% by adopting agile methodologies</li>
                <li>Holds a BSc in Architecture, demonstrating a strong foundation in human-centered design</li>
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-6">Skills</h2>
            <div className="space-y-8">
              {/* Soft Skills */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">Soft Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {skillCategories.softSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="glass text-sm px-4 py-2 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">Technical Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {skillCategories.technicalSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="glass text-sm px-4 py-2 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 text-primary-visible">Tools</h3>
                <div className="flex flex-wrap gap-3">
                  {skillCategories.tools.map((skill, index) => (
                    <span
                      key={index}
                      className="glass text-sm px-4 py-2 rounded-full hover:shadow-lg transition-all duration-350 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-8">Experience Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30" />

              {timelineNodes.map((node, index) => (
                <div
                  key={index}
                  className="relative mb-12 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`flex items-start gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2 z-10" />

                    {/* Content card */}
                    <div
                      className={`ml-16 md:ml-0 w-full md:w-[calc(50%-3rem)] ${
                        index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                      }`}
                    >
                      <div className="glass p-6 rounded-[1.5rem] hover:shadow-xl transition-all duration-350">
                        <h3 className="text-2xl font-display font-bold mb-1">{node.title}</h3>
                        <p className="text-primary font-semibold mb-2 text-sm">{node.role}</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          {node.dates}
                        </p>
                        <ul
                          className={`space-y-2 text-xs ${
                            index % 2 === 0
                              ? "md:text-right"
                              : "md:text-left"
                          }`}
                        >
                          {node.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-muted-foreground">
                              • {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CV;
