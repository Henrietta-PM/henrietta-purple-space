import { useMemo, useState } from "react";
import { ChevronLeft, LayoutGrid, Search, Share, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import prdTemplateComplete from "@/assets/prd-template-complete.png";
import prdTemplateOverview from "@/assets/prd-template-overview.png";
import henrietta from "@/assets/henrietta-portrait.jpg";
import { AppleSearch, AppleSections } from "./apple-app-chrome";
import "./shop-app.css";

interface ShopProduct { id: string; title: string; subtitle: string; image: string; url: string; badge: string }

export const shopProducts: ShopProduct[] = [
  { id: "complete", title: "Complete 3-in-1 PRD Template", subtitle: "Copy & Paste PRD Templates for PMs & Founders", image: prdTemplateComplete, url: "https://selar.com/49gf07l554", badge: "Premium" },
  { id: "overview", title: "PRD Overview + User Flows Templates", subtitle: "Copy & Paste PRD Templates for PMs & Founders", image: prdTemplateOverview, url: "https://selar.com/1r76753817", badge: "Most Popular" },
];

const developer = "Henrietta Onwuneme";

function GetButton({ product, large = false }: { product: ShopProduct; large?: boolean }) {
  return <a className={`as-get ${large ? "large" : ""}`} href={product.url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Get ${product.title}`}>Get</a>;
}

function ProductRow({ product, onOpen }: { product: ShopProduct; onOpen: () => void }) {
  return <div className="as-row" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter") onOpen(); }}>
    <img className="as-icon" src={product.image} alt="" loading="lazy" />
    <div className="as-row-text"><strong>{product.title}</strong><span>{product.subtitle}</span></div>
    <GetButton product={product} />
  </div>;
}

function ProductPage({ product, onBack }: { product: ShopProduct; onBack: () => void }) {
  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: product.title, url: product.url }); return; }
      await navigator.clipboard.writeText(product.url);
      toast.success("Link copied");
    } catch { /* share cancelled */ }
  };
  return <div className="as-page">
    <div className="as-page-bar">
      <Button variant="ghost" className="as-back" onClick={onBack}><ChevronLeft />Back</Button>
      <Button variant="ghost" size="icon" className="as-share" aria-label="Share" onClick={share}><Share /></Button>
    </div>
    <header className="as-page-head">
      <img className="as-icon xl" src={product.image} alt="" />
      <div className="as-page-title">
        <h1>{product.title}</h1>
        <p>{product.subtitle}</p>
        <div className="as-page-actions"><GetButton product={product} large /></div>
      </div>
    </header>
    <dl className="as-info-strip">
      <div><dt>Category</dt><dd>Templates</dd><span>Productivity</span></div>
      <div><dt>Developer</dt><dd className="as-dev"><img src={henrietta} alt="" /></dd><span>{developer}</span></div>
      <div><dt>Format</dt><dd>PRD</dd><span>Digital</span></div>
    </dl>
    <section className="as-section"><h2>Preview</h2><div className="as-shots"><img src={product.image} alt={`${product.title} preview`} /></div></section>
    <section className="as-section"><p className="as-desc">{product.subtitle}. Built by {developer} to help you ship better products.</p></section>
    <section className="as-section"><h2>Information</h2>
      <dl className="as-table"><div><dt>Seller</dt><dd>{developer}</dd></div><div><dt>Category</dt><dd>Templates</dd></div><div><dt>Store</dt><dd>Selar</dd></div></dl>
    </section>
  </div>;
}

export default function ShopApp({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState("today");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const product = shopProducts.find((item) => item.id === openId);
  const results = useMemo(() => shopProducts.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const featured = shopProducts[0];

  return <AppleSections compact={compact} title="App Store" selected={tab} onSelect={(id) => { setTab(id); setOpenId(null); }} sections={[{ id: "today", label: "Today", icon: Sparkles }, { id: "apps", label: "Apps", icon: LayoutGrid }, { id: "search", label: "Search", icon: Search }]}>
    <div className={`app-store ${compact ? "as-phone" : "as-mac"}`}>
      {product ? <ProductPage product={product} onBack={() => setOpenId(null)} /> : <>
        {tab === "today" && <>
          <header className="as-head"><small>{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</small><h1>Today</h1></header>
          <button type="button" className="as-story" onClick={() => setOpenId(featured.id)}>
            <div className="as-story-text"><small>{featured.badge}</small><h2>Write your next PRD in minutes</h2></div>
            <img src={featured.image} alt="" />
            <div className="as-story-foot"><img className="as-icon sm" src={featured.image} alt="" /><div className="as-row-text"><strong>{featured.title}</strong><span>{featured.subtitle}</span></div><GetButton product={featured} /></div>
          </button>
          <section className="as-section"><h2>{shopProducts[1].badge}</h2><ProductRow product={shopProducts[1]} onOpen={() => setOpenId(shopProducts[1].id)} /></section>
        </>}
        {tab === "apps" && <>
          <header className="as-head"><h1>Apps</h1></header>
          <section className="as-section"><h2>Templates by {developer}</h2>{shopProducts.map((item) => <ProductRow key={item.id} product={item} onOpen={() => setOpenId(item.id)} />)}</section>
        </>}
        {tab === "search" && <>
          <header className="as-head"><h1>Search</h1></header>
          <div className="as-search"><AppleSearch value={query} onChange={setQuery} label="Search the shop" /></div>
          <section className="as-section">{results.length ? results.map((item) => <ProductRow key={item.id} product={item} onOpen={() => setOpenId(item.id)} />) : <p className="as-empty">No results</p>}</section>
        </>}
      </>}
    </div>
  </AppleSections>;
}
