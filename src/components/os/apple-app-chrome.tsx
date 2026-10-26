import { type ReactNode } from "react";
import { Search, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./apple-app-chrome.css";

export interface AppleSection { id: string; label: string; icon: LucideIcon }

export function AppleSections({ compact, sections, selected, onSelect, children, title }: { compact: boolean; sections: AppleSection[]; selected: string; onSelect: (id: string) => void; children: ReactNode; title: string }) {
  const navigation = <nav className={compact ? "apple-tabbar" : "apple-sidebar"} aria-label={`${title} sections`}>
    {!compact && <h2>{title}</h2>}
    {sections.map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" className={selected === id ? "selected" : ""} aria-current={selected === id ? "page" : undefined} onClick={() => onSelect(id)}><Icon aria-hidden="true" /><span>{label}</span></Button>)}
  </nav>;
  return <div className={`apple-app-layout ${compact ? "apple-phone" : "apple-mac"}`}>{!compact && navigation}<div className="apple-app-main">{children}</div>{compact && navigation}</div>;
}

export function AppleSearch({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <label className="apple-search"><Search aria-hidden="true" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search" aria-label={label} /></label>;
}