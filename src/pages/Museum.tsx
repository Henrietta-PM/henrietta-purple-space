import { Component, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Download, Home, Mail, Map, RotateCcw, RotateCw, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MuseumScene } from '@/components/museum/museum-scene';
import MuseumGallery from '@/components/museum/museum-gallery';
import { pavilions, type Pavilion, type TourPhase } from '@/components/museum/museum-model';
import cvAsset from '@/assets/henrietta-cv.pdf.asset.json';
import { HIRE_CALENDAR_URL, openHireCalendar } from '@/lib/booking';
import '@/components/museum/museum.css';

class MuseumBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="museum-fallback"><h2>The museum could not load on this device.</h2><Button asChild><Link to="/projects">View projects</Link></Button></div> : this.props.children; }
}

export function Museum() {
  const [phase, setPhase] = useState<TourPhase>('grounds');
  const [selected, setSelected] = useState<Pavilion | null>(null);
  const [angle, setAngle] = useState(0.48);
  const [mapOpen, setMapOpen] = useState(false);
  const reduced = Boolean(useReducedMotion());
  const select = useCallback((pavilion: Pavilion) => { setSelected(pavilion); setPhase('walking'); setMapOpen(false); }, []);
  const returnToGrounds = useCallback(() => { setPhase('grounds'); setSelected(null); }, []);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') returnToGrounds(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [returnToGrounds]);
  const arrive = useCallback(() => setPhase('opening'), []);
  const doorOpen = useCallback(() => setPhase('ready'), []);
  const enter = useCallback(() => setPhase('gallery'), []);
  return <main className="museum-shell">
    <div className="museum-canvas"><MuseumBoundary><Suspense fallback={<div className="museum-loading">Preparing the museum...</div>}><Canvas shadows dpr={1} camera={{ position: [20, 34, 37], fov: 48, near: 0.1, far: 250 }} gl={{ antialias: true }}><MuseumScene selected={selected} phase={phase} reduced={reduced} angle={angle} onSelect={select} onArrive={arrive} onDoorOpen={doorOpen} onEnter={enter} /></Canvas></Suspense></MuseumBoundary></div>
    <header className="museum-topbar"><Link to="/" className="museum-brand">MyPvrpleSpace<span>THE PRODUCT MUSEUM</span></Link><nav aria-label="Museum navigation" className="museum-toplinks"><Button asChild variant="ghost" size="sm"><Link to="/projects">Projects <ArrowUpRight /></Link></Button><Button asChild variant="ghost" size="sm"><Link to="/cv">CV</Link></Button><Button asChild variant="default" size="sm"><a href={HIRE_CALENDAR_URL} onClick={openHireCalendar} target="_blank" rel="noopener noreferrer"><Calendar /> Hire Henrietta</a></Button></nav></header>
    {phase !== 'gallery' && <><div className="museum-title"><span>AN EXHIBITION BY HENRIETTA ONWUNEME</span><h1>The Product<br /><span className="font-handwritten">Museum.</span></h1></div><div className="museum-tools"><Button variant="secondary" size="icon" title="Rotate view left" aria-label="Rotate view left" onClick={() => setAngle((value) => value - 0.25)}><RotateCcw /></Button><Button variant="secondary" size="icon" title="Rotate view right" aria-label="Rotate view right" onClick={() => setAngle((value) => value + 0.25)}><RotateCw /></Button><Sheet open={mapOpen} onOpenChange={setMapOpen}><SheetTrigger asChild><Button variant="secondary" size="icon" title="Museum directory" aria-label="Museum directory"><Map /></Button></SheetTrigger><SheetContent className="museum-directory"><SheetHeader><SheetTitle>The collection</SheetTitle></SheetHeader><div className="museum-directory-items">{pavilions.map((pavilion) => <Button key={pavilion.id} variant="ghost" onClick={() => select(pavilion)}><span>{String(pavilion.id + 1).padStart(2, '0')}</span>{pavilion.project.name}<ArrowRight /></Button>)}</div><Button asChild variant="outline"><Link to="/projects">View projects as a list <ArrowUpRight /></Link></Button></SheetContent></Sheet></div></>}
    {selected && phase !== 'gallery' && <div className="museum-arrival" aria-live="polite"><span>GALLERY {String(selected.id + 1).padStart(2, '0')}</span><h2>{selected.project.name}</h2><div className="museum-arrival-actions">{phase === 'ready' ? <Button onClick={() => setPhase('entering')}>Enter <ArrowRight /></Button> : <p>{phase === 'walking' ? 'Walking to the gallery...' : phase === 'entering' ? 'Entering...' : 'Opening the door...'}</p>}<Button variant="ghost" size="icon" aria-label="Return to grounds" onClick={returnToGrounds}><X /></Button></div></div>}
    <AnimatePresence>{phase === 'gallery' && selected && <MuseumGallery project={selected.project} onReturn={returnToGrounds} reduced={reduced} />}</AnimatePresence>
    <footer className="museum-footer"><div className="museum-credit">Louisiana-inspired, Denmark<span>Original architectural interpretation</span></div><nav className="museum-dock" aria-label="Portfolio shortcuts"><Button asChild variant="ghost" size="icon" title="Portfolio home"><Link to="/" aria-label="Portfolio home"><Home /></Link></Button><Button asChild variant="ghost" size="icon" title="Download CV"><a href={cvAsset.url} download="Henrietta-Onwuneme-CV.pdf" aria-label="Download CV"><Download /></a></Button><Button asChild variant="ghost" size="icon" title="Letter"><Link to="/letter" aria-label="Letter"><Mail /></Link></Button><Button asChild variant="ghost" size="icon" title="Shop"><Link to="/shop" aria-label="Shop"><ShoppingBag /></Link></Button><Button asChild variant="ghost" size="icon" title="Contact"><Link to="/contact" aria-label="Contact"><ArrowUpRight /></Link></Button></nav><Button asChild variant="link" className="museum-list-link"><Link to="/projects">Project list <ArrowRight /></Link></Button></footer>
  </main>;
}
