import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://hirehenrietta.lovable.app";

interface PageMeta {
  title: string;
  description: string;
  schema?: Record<string, unknown>;
}

const person = {
  "@type": "Person",
  name: "Henrietta Onwuneme",
  jobTitle: "Product Manager",
  url: BASE_URL,
  email: "mailto:mypvrplespace@gmail.com",
  knowsAbout: ["Product Management", "AI Products", "HealthTech", "SaaS", "EdTech"],
};

const pages: Record<string, PageMeta> = {
  "/": {
    title: "Henrietta Onwuneme | Product Manager Portfolio",
    description:
      "Product Manager with 3+ years shipping AI-enabled healthcare and SaaS products. Explore projects, experience, and ways to work together.",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", name: "Hire Henrietta", url: BASE_URL },
        person,
      ],
    },
  },
  "/projects": {
    title: "Projects | Henrietta Onwuneme, Product Manager",
    description:
      "Product case studies by Henrietta Onwuneme, including ProxyMedicine, Bloomie AI, Sally, Targett, VibeStack, and a public-sector attendance platform.",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Projects by Henrietta Onwuneme",
      url: `${BASE_URL}/projects`,
      author: person,
    },
  },
  "/cv": {
    title: "Curriculum Vitae | Henrietta Onwuneme",
    description:
      "Experience, skills, and education of Henrietta Onwuneme, a Product Manager focused on AI, healthcare, and SaaS products.",
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: `${BASE_URL}/cv`,
      mainEntity: {
        ...person,
        hasOccupation: { "@type": "Occupation", name: "Product Manager" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "University of Uyo" },
      },
    },
  },
  "/letter": {
    title: "A Letter to My Future Team | Henrietta Onwuneme",
    description:
      "A personal letter from Henrietta Onwuneme to her potential team or employer about how she works and what she brings.",
  },
  "/contact": {
    title: "Contact | Henrietta Onwuneme, Product Manager",
    description:
      "Get in touch with Henrietta Onwuneme to discuss product roles, collaborations, or book a call.",
  },
  "/shop": {
    title: "Shop | Henrietta Onwuneme",
    description: "Digital products and resources created by Henrietta Onwuneme, Product Manager.",
  },
};

const RouteSeo = () => {
  const { pathname } = useLocation();
  const meta = pages[pathname];
  if (!meta) return null;
  const url = `${BASE_URL}${pathname === "/" ? "/" : pathname}`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.schema && <script type="application/ld+json">{JSON.stringify(meta.schema)}</script>}
    </Helmet>
  );
};

export default RouteSeo;
