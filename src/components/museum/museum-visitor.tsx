import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Box3, Group, Mesh, Vector3 } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import visitorAsset from '@/assets/museum/visitor.glb.asset.json';
import { advancePosition, routeToDoor, type Pavilion, type Point, type TourPhase } from './museum-model';

interface VisitorProps {
  selected: Pavilion | null;
  phase: TourPhase;
  reduced: boolean;
  onArrive: () => void;
  onEnter: () => void;
}

export function MuseumVisitor({ selected, phase, reduced, onArrive, onEnter }: VisitorProps) {
  const root = useRef<Group>(null);
  const rig = useRef<Group>(null);
  const position = useRef<Point>([0, 0.15, 9]);
  const route = useRef<Point[]>([]);
  const waypoint = useRef(0);
  const fired = useRef(false);
  const { scene, animations } = useGLTF(visitorAsset.url);
  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((item) => { if (item instanceof Mesh) { item.castShadow = true; item.frustumCulled = false; } });
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    return { clone, scale: 1.75 / (size.y || 1), offset: -box.min.y };
  }, [scene]);
  const { actions } = useAnimations(animations, rig);

  useEffect(() => {
    const moving = phase === 'walking' || phase === 'entering';
    const name = moving ? 'Walk_Loop' : phase === 'opening' ? 'Interact' : 'Idle_Loop';
    const action = actions[name];
    action?.reset().fadeIn(0.25).play();
    if (action && reduced) action.timeScale = 0;
    return () => { action?.fadeOut(0.25); };
  }, [phase, actions, reduced]);

  useEffect(() => {
    if (!selected) return;
    fired.current = false;
    waypoint.current = 0;
    if (phase === 'walking') {
      const from = position.current;
      const to = selected.door;
      route.current = from[2] >= 1 && to[2] > -10 ? [[from[0], 0.15, 3], [to[0], 0.15, 3], to] : routeToDoor(from, to);
    } else if (phase === 'entering') {
      route.current = [[selected.position[0], 0.15, selected.position[2] + 1]];
    }
  }, [selected, phase]);

  useFrame((_, rawDelta) => {
    const group = root.current;
    if (!group) return;
    if ((phase === 'walking' || phase === 'entering') && !fired.current) {
      const target = route.current[waypoint.current];
      if (target) {
        const from = position.current;
        const step = advancePosition(from, target, reduced ? 1000 : Math.min(rawDelta, 0.05) * 4.8);
        const yaw = Math.atan2(target[0] - from[0], target[2] - from[2]);
        const diff = Math.atan2(Math.sin(yaw - group.rotation.y), Math.cos(yaw - group.rotation.y));
        group.rotation.y += diff * (1 - Math.exp(-10 * Math.min(rawDelta, 0.05)));
        position.current = step.position;
        if (step.arrived) waypoint.current += 1;
      } else {
        fired.current = true;
        if (phase === 'walking') onArrive(); else onEnter();
      }
    }
    group.position.set(...position.current);
  });

  return <group ref={root}><group scale={model.scale} position-y={model.offset * model.scale}><group ref={rig}><primitive object={model.clone} /></group></group></group>;
}
