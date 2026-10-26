import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Monitor, Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useOsTheme } from "./use-os-theme";
import { AppleSections } from "./apple-app-chrome";

export default function SettingsApp({ compact = false }: { compact?: boolean }) {
  const { pref, setPref } = useOsTheme();
  const [display, setDisplay] = useState(!compact);
  return <AppleSections compact={false} title="System Settings" sections={compact ? [] : [{ id: "display", label: "Appearance", icon: Sun }]} selected="display" onSelect={() => setDisplay(true)}>
    <div className="apple-settings">
      {display ? <>
        <header className="apple-toolbar">{compact && <Button variant="ghost" size="icon" aria-label="Back to Settings" onClick={() => setDisplay(false)}><ChevronLeft /></Button>}<h2>{compact ? "Display & Brightness" : "Appearance"}</h2></header>
        <p className="apple-section-label">Appearance</p>
        <div className="apple-group">
          <div className="apple-appearance" role="radiogroup" aria-label="Appearance">
            {(["light", "dark"] as const).map((value) => <Button key={value} variant="ghost" role="radio" aria-checked={pref === value} onClick={() => setPref(value)}><span className={`apple-appearance-preview ${value}`} aria-hidden="true"><i /><i /><i /></span><span>{value === "light" ? "Light" : "Dark"}</span><span className={`apple-choice ${pref === value ? "selected" : ""}`}>{pref === value && <Check />}</span></Button>)}
          </div>
          <div className="apple-group-row"><span>Automatic</span><Switch checked={pref === "system"} onCheckedChange={(checked) => setPref(checked ? "system" : "dark")} aria-label="Automatic appearance" /></div>
        </div>
      </> : <>
        <h1 className="apple-page-heading">Settings</h1>
        <div className="apple-group"><Button variant="ghost" className="apple-group-row" onClick={() => setDisplay(true)}><Sun /><span>Display &amp; Brightness</span><ChevronRight /></Button></div>
      </>}
    </div>
  </AppleSections>;
}