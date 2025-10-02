import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const timelineNodes = [
  {
    title: "ProxyMedicine",
    role: "Team Lead / Product Manager",
    dates: "Feb 2025 – Current",
    highlights: [
      "Patient satisfaction +60%",
      "Roadmap delivery 25% faster",
      "Defects reduced 15%",
    ],
  },
  {
    title: "Bloomie",
    role: "Product Manager",
    dates: "Nov 2024 – May 2025",
    highlights: [
      "Defined AI-driven learning MVP",
      "80% daily adoption, 45% retention uplift",
    ],
  },
  {
    title: "Qwikdrip",
    role: "Product Manager",
    dates: "May 2024 – Dec 2024",
    highlights: [
      "20+ user interviews guided prioritization",
      "20% increase in positive reviews",
    ],
  },
  {
    title: "Umbaji",
    role: "Project Manager",
    dates: "May 2023 – Feb 2024",
    highlights: ["Launched Yodi AI language model", "Managed 1,500 contributors"],
  },
  {
    title: "Syncu",
    role: "Team Lead / Product Manager",
    dates: "Jan 2024 – Current",
    highlights: ["Scaled to 250+ members", "10+ product collaborations"],
  },
  {
    title: "University of Uyo",
    role: "BSc Architecture",
    dates: "2018 – 2024",
    highlights: ["Foundation in design and human-centered thinking"],
  },
];

const CV = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">CV Timeline</h1>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            My journey through product management and beyond
          </p>

          <div className="max-w-4xl mx-auto">
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
                      <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-350">
                        <h3 className="text-2xl font-bold mb-1">{node.title}</h3>
                        <p className="text-primary font-semibold mb-2">{node.role}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {node.dates}
                        </p>
                        <ul
                          className={`space-y-2 text-sm ${
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
