import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Image, Lightformer, useTexture, useGLTF } from '@react-three/drei';
import { Group, Mesh, Vector3 } from 'three';
import stoneAsset from '@/assets/museum/stone.jpg.asset.json';
import grassAsset from '@/assets/museum/grass.jpg.asset.json';
import woodAsset from '@/assets/museum/wood.jpg.asset.json';
import treeAsset from '@/assets/museum/tree.glb.asset.json';
import { Button } from '@/components/ui/button';
import { pavilions, type Pavilion, type TourPhase } from './museum-model';
import { museumAssetUrl, readMuseumPalette, repeatTexture, type MuseumPalette } from './museum-materials';
import { MuseumVisitor } from './museum-visitor';

interface SceneProps {
  selected: Pavilion | null;
  phase: TourPhase;
  reduced: boolean;
  angle: number;
  onSelect: (pavilion: Pavilion) => void;
  onArrive: () => void;
  onDoorOpen: () => void;
  onEnter: () => void;
}

function Box({ position, size, color, map, metalness = 0, roughness = 0.8 }: { position: [number, number, number]; size: [number, number, number]; color: string; map?: ReturnType<typeof repeatTexture>; metalness?: number; roughness?: number }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} map={map} metalness={metalness} roughness={roughness} /></mesh>;
}

function PavilionBuilding({ pavilion, palette, selected, phase, reduced, onSelect, onDoorOpen, maps }: { pavilion: Pavilion; palette: MuseumPalette; selected: boolean; phase: TourPhase; reduced: boolean; onSelect: SceneProps['onSelect']; onDoorOpen: () => void; maps: { stone: ReturnType<typeof repeatTexture>; wood: ReturnType<typeof repeatTexture> } }) {
  const hinge = useRef<Group>(null);
  const reported = useRef(false);
  const { width: w, depth: d, project } = pavilion;
  const open = selected && ['opening', 'ready', 'entering', 'gallery'].includes(phase);
  useEffect(() => { reported.current = false; }, [open]);
  useFrame((_, rawDelta) => {
    if (!hinge.current) return;
    const target = open ? -Math.PI * 0.48 : 0;
    hinge.current.rotation.y += (target - hinge.current.rotation.y) * (reduced ? 1 : 1 - Math.exp(-5 * Math.min(rawDelta, 0.05)));
    if (open && phase === 'opening' && Math.abs(hinge.current.rotation.y - target) < 0.03 && !reported.current) { reported.current = true; onDoorOpen(); }
  });
  return (
    <group position={pavilion.position} onClick={(event) => { event.stopPropagation(); onSelect(pavilion); }}>
      <Box position={[0, 0.06, 0]} size={[w + 0.8, 0.12, d + 1]} color={palette.stone} map={maps.stone} />
      <Box position={[0, 1.9, -d / 2]} size={[w, 3.7, 0.25]} color={palette.wall} />
      <Box position={[-w / 2, 1.9, 0]} size={[0.25, 3.7, d]} color={palette.wall} />
      <Box position={[w / 2, 1.9, 0]} size={[0.25, 3.7, d]} color={palette.wall} />
      <Box position={[0, 3.85, 0]} size={[w + 1.1, 0.28, d + 1]} color={palette.metal} metalness={0.45} />
      <Box position={[0, 3.65, 0]} size={[w + 0.6, 0.12, d + 0.5]} color={palette.wood} map={maps.wood} />
      <Box position={[0, 0.18, 0]} size={[w - 0.2, 0.12, d - 0.2]} color={palette.stone} map={maps.stone} />
      {[-1, 1].map((side) => <group key={side}>
        <mesh position={[side * (w / 4 + 0.5), 1.9, d / 2]}><boxGeometry args={[w / 2 - 1, 3.5, 0.035]} /><meshStandardMaterial color={palette.glass} transparent opacity={0.24} metalness={0.5} roughness={0.12} depthWrite={false} /></mesh>
        {[0, 1, 2].map((index) => <Box key={index} position={[side * (1 + index * (w / 2 - 1) / 2), 1.9, d / 2]} size={[0.055, 3.6, 0.08]} color={palette.metal} metalness={0.7} />)}
      </group>)}
      <Box position={[0, 3.4, d / 2 + 0.06]} size={[w, 0.1, 0.1]} color={palette.metal} />
      <group ref={hinge} position={[-0.9, 0.22, d / 2 + 0.07]}>
        <Box position={[0.9, 1.5, 0]} size={[1.8, 3, 0.08]} color={palette.wood} map={maps.wood} />
        <Box position={[1.55, 1.4, 0.1]} size={[0.045, 0.48, 0.08]} color={palette.metal} metalness={0.8} />
      </group>
      <Box position={[0, 3.25, d / 2 + 0.1]} size={[2.8, 0.5, 0.06]} color={palette.paper} />
      <Html position={[0, 4.7, 1]} center zIndexRange={[15, 0]}>
        <Button variant="secondary" size="sm" className="museum-label" onClick={(event) => { event.stopPropagation(); onSelect(pavilion); }} aria-label={`Visit ${project.name}`}><span className="museum-label-number">{String(pavilion.id + 1).padStart(2, '0')}</span>{project.name}</Button>
      </Html>
      <Suspense fallback={null}><Image url={project.image} position={[-1.25, 2.1, -d / 2 + 0.15]} scale={[w - 3, 2.5]} transparent={false} /></Suspense>
      <Box position={[w / 2 - 1.1, 0.6, 0]} size={[1, 1.1, 1]} color={palette.wall} />
      <mesh position={[w / 2 - 1.1, 1.45, 0]} rotation={[0.2, 0.4, 0.1]}><torusKnotGeometry args={[0.42, 0.12, 48, 8]} /><meshStandardMaterial color={palette.accent} metalness={0.5} roughness={0.25} /></mesh>
      <pointLight position={[0, 3.1, 0]} intensity={5} distance={9} color={palette.paper} />
    </group>
  );
}

function CameraRig({ selected, phase, angle, reduced }: Pick<SceneProps, 'selected' | 'phase' | 'angle' | 'reduced'>) {
  const look = useRef(new Vector3(0, 0, -7));
  const { size } = useThree();
  useFrame(({ camera }, rawDelta) => {
    const close = selected && ['opening', 'ready', 'entering', 'gallery'].includes(phase);
    let destination: Vector3;
    let target: Vector3;
    if (close && selected) {
      const [x, , z] = selected.position;
      const inside = phase === 'gallery';
      destination = new Vector3(x + (inside ? 2.5 : 5), inside ? 2.5 : 5.5, z + (inside ? 2.8 : 12));
      target = new Vector3(x - (inside ? 1.4 : 0), 1.9, z - 1.5);
    } else {
      const narrow = size.width < 700;
      destination = new Vector3(Math.sin(angle) * (narrow ? 52 : 44), narrow ? 49 : 34, Math.cos(angle) * (narrow ? 55 : 42) - 5);
      target = new Vector3(0, 0, -8);
    }
    const blend = reduced ? 1 : 1 - Math.exp(-2.4 * Math.min(rawDelta, 0.05));
    camera.position.lerp(destination, blend);
    look.current.lerp(target, blend);
    camera.lookAt(look.current);
  });
  return null;
}

function Landscape({ palette, maps }: { palette: MuseumPalette; maps: { grass: ReturnType<typeof repeatTexture>; stone: ReturnType<typeof repeatTexture>; wood: ReturnType<typeof repeatTexture> } }) {
  return <>
    <mesh rotation-x={-Math.PI / 2} position-y={-0.04} receiveShadow><planeGeometry args={[180, 180]} /><meshStandardMaterial map={maps.grass} color={palette.grass} /></mesh>
    <Box position={[0, 0.02, 3]} size={[57, 0.1, 4]} color={palette.stone} map={maps.stone} />
    <Box position={[0, 0.02, -13]} size={[57, 0.1, 4]} color={palette.stone} map={maps.stone} />
    <Box position={[26, 0.02, -5]} size={[4, 0.1, 20]} color={palette.stone} map={maps.stone} />
    <Box position={[0, 0.02, 9]} size={[5, 0.1, 10]} color={palette.stone} map={maps.stone} />
    <Box position={[-12, 0.03, 12]} size={[14, 0.1, 7]} color={palette.metal} />
    <mesh rotation-x={-Math.PI / 2} position={[-12, 0.12, 12]}><planeGeometry args={[13.6, 6.6]} /><meshStandardMaterial color={palette.water} metalness={0.65} roughness={0.18} transparent opacity={0.85} /></mesh>
    {[-20, -10, 8, 19].map((x) => <group key={x} position={[x, 0, 7]}>
      <Box position={[0, 0.6, 0]} size={[2.8, 0.16, 0.7]} color={palette.wood} map={maps.wood} />
      {[-1, 1].map((side) => <Box key={side} position={[side, 0.3, 0]} size={[0.12, 0.6, 0.55]} color={palette.metal} />)}
    </group>)}
    <group position={[8, 0, 12]}><Box position={[0, 0.5, 0]} size={[1.6, 1, 1.6]} color={palette.wall} /><mesh position={[0, 2.4, 0]} rotation={[0.3, 0.5, 0]}><torusKnotGeometry args={[1.2, 0.25, 90, 12]} /><meshStandardMaterial color={palette.accent} metalness={0.65} roughness={0.26} /></mesh></group>
    {[-13, 0, 13].map((x) => <Box key={x} position={[x, 0.02, 0]} size={[2.1, 0.1, 6]} color={palette.stone} map={maps.stone} />)}
    {[-22, -11, 0, 11, 22].map((x) => <Box key={x} position={[x, 0.02, -16]} size={[2.1, 0.1, 6]} color={palette.stone} map={maps.stone} />)}
    {[-7, 6].map((x) => <group key={x} position={[x, 0, -5]}>
      <Box position={[0, 2.8, 0]} size={[3.1, 0.16, 4]} color={palette.metal} />
      {[-1.4, 1.4].map((side) => <mesh key={side} position={[0, 1.4, side]}><boxGeometry args={[3.1, 2.7, 0.04]} /><meshStandardMaterial color={palette.glass} transparent opacity={0.22} depthWrite={false} /></mesh>)}
    </group>)}
  </>;
}

function TexturedCampus(props: SceneProps & { palette: MuseumPalette }) {
  const textures = useTexture([stoneAsset.url, grassAsset.url, woodAsset.url].map(museumAssetUrl));
  const maps = useMemo(() => ({ stone: repeatTexture(textures[0], 5), grass: repeatTexture(textures[1], 35), wood: repeatTexture(textures[2], 2) }), [textures]);
  useEffect(() => () => { Object.values(maps).forEach((map) => map.dispose()); }, [maps]);
  return <><Landscape palette={props.palette} maps={maps} />{pavilions.map((pavilion) => <PavilionBuilding key={pavilion.id} pavilion={pavilion} palette={props.palette} selected={props.selected?.id === pavilion.id} phase={props.phase} reduced={props.reduced} onSelect={props.onSelect} onDoorOpen={props.onDoorOpen} maps={maps} />)}</>;
}

function Planting() {
  const { scene } = useGLTF(museumAssetUrl(treeAsset.url));
  const trees = useMemo(() => Array.from({ length: 22 }, (_, index) => {
    const tree = scene.clone(true);
    tree.traverse((object) => { if (object instanceof Mesh) object.castShadow = true; });
    const side = index % 2 === 0 ? -1 : 1;
    tree.position.set(side * (31 + (index % 3) * 4), 0, 18 - Math.floor(index / 2) * 5.2);
    tree.scale.setScalar(3.5 + index % 3);
    tree.rotation.y = index * 0.9;
    return tree;
  }), [scene]);
  return <>{trees.map((tree, index) => <primitive key={index} object={tree} />)}</>;
}

export function MuseumScene(props: SceneProps) {
  const palette = useMemo(readMuseumPalette, []);
  return <>
    <color attach="background" args={[palette.sky]} /><fog attach="fog" args={[palette.sky, 80, 170]} />
    <hemisphereLight args={[palette.paper, palette.grass, 1.5]} />
    <directionalLight position={[-30, 40, 25]} intensity={2.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-45} shadow-bias={-0.0003} />
    <Environment resolution={128}><Lightformer intensity={2} position={[0, 20, 0]} rotation-x={-Math.PI / 2} scale={[80, 80, 1]} /><Lightformer intensity={1} color={palette.sky} position={[30, 5, 0]} rotation-y={-Math.PI / 2} scale={[40, 20, 1]} /></Environment>
    <mesh rotation-x={-Math.PI / 2} position-y={-0.08}><planeGeometry args={[180, 180]} /><meshStandardMaterial color={palette.grass} /></mesh>
    <Suspense fallback={<Html center><div className="museum-loading">Preparing the grounds...</div></Html>}><TexturedCampus {...props} palette={palette} /></Suspense>
    <Suspense fallback={null}><MuseumVisitor {...props} /></Suspense>
    <Suspense fallback={null}><Planting /></Suspense>
    <CameraRig {...props} />
  </>;
}
