export const aboutMeNote = {
  id: "about-me" as const,
  title: "About Me",
  greeting: "Hi, I'm Henrietta.",
  preview: "Product management for me is about people, their needs, and the paths we create to meet them.",
  highlights: [
    "85% dev time saved",
    "5+ MVPs shipped",
    "3+ years of experience",
    "$1.2M IP value",
  ],
  paragraphs: [
    "I'm a Product Manager based in Lagos, Nigeria, with a background in architecture.",
    "My work includes healthcare, education and SaaS products. I've worked on ProxyMedicine, StatWellMD and Bloomie, taking ideas through research, product planning and delivery with designers and engineers.",
    "I spend time understanding what people need, turning that into clear user flows and product requirements, and working with teams to get products into people's hands. I also use AI to prototype and test ideas.",
  ],
};

export type NoteId = "about-me" | "letter";

export const portfolioNotes: { id: NoteId; title: string; preview: string }[] = [
  aboutMeNote,
  { id: "letter", title: "To My Next Team", preview: "My path into product management started with curiosity and grew through resilience." },
];