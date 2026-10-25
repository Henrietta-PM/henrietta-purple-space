import { Color, RepeatWrapping, SRGBColorSpace, Texture } from 'three';

export type MuseumPalette = Record<'sky' | 'stone' | 'wall' | 'metal' | 'wood' | 'grass' | 'water' | 'glass' | 'paper' | 'ink' | 'accent', string>;

export function readMuseumPalette(): MuseumPalette {
  const style = getComputedStyle(document.documentElement);
  const keys = ['sky', 'stone', 'wall', 'metal', 'wood', 'grass', 'water', 'glass', 'paper', 'ink', 'accent'] as const;
  return Object.fromEntries(keys.map((key) => [key, new Color(`hsl(${style.getPropertyValue(`--museum-${key}`).trim()})`).getStyle()])) as MuseumPalette;
}

export function repeatTexture(source: Texture, repeat: number): Texture {
  const texture = source.clone();
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
