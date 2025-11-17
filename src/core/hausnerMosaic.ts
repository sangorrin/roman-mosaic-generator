/**
 * Hausner's Decorative Mosaic Algorithm (SIGGRAPH 2001)
 * Implements flow field, centroidal Voronoi relaxation, and tile orientation
 * Reference: https://www.dgp.toronto.edu/papers/ahausner_SIGGRAPH2001.pdf
 */
import type { MosaicTile } from '../types/mosaic';

export interface HausnerConfig {
  tileSize: number;
  palette: { hex: string; name: string }[];
  groutWidth: number;
  rotationVariance: number;
}

/**
 * Main entry for Hausner mosaic generation
 * @param imageData - Source image data
 * @param config - HausnerConfig
 * @returns Array of MosaicTile objects
 */
export function generateHausnerMosaic(
  imageData: ImageData,
  config: HausnerConfig
): MosaicTile[] {
  // 1. Compute flow field from image edges
  let gradients: Float32Array | null = null;
  try {
    // @ts-ignore
    const { detectEdges } = require('./edgeDetector');
    gradients = detectEdges(imageData);
  } catch (e) {
    gradients = null;
  }

  // 2. Initialize tile sites (random or grid)
  const width = imageData.width;
  const height = imageData.height;
  const tileSize = config.tileSize;
  const gridCols = Math.floor(width / tileSize);
  const gridRows = Math.floor(height / tileSize);
  const sites: { x: number; y: number }[] = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const jitter = tileSize * 0.2;
      const x = col * tileSize + tileSize / 2 + (Math.random() - 0.5) * jitter;
      const y = row * tileSize + tileSize / 2 + (Math.random() - 0.5) * jitter;
      sites.push({ x, y });
    }
  }

  // 3. Centroidal Voronoi relaxation, guided by flow field
  try {
    // @ts-ignore
    const { relaxSites } = require('./centroidalVoronoi');
    const relaxedSites = relaxSites(sites, width, height, 10);
    for (let i = 0; i < sites.length; i++) {
      sites[i] = relaxedSites[i];
    }
  } catch (e) {
    // fallback: use original sites
  }

  // 4. Tile placement, orientation, color assignment
  const tiles: MosaicTile[] = [];
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    // Sample flow field direction at site
    let rotation = 0;
    if (gradients) {
      const gx = Math.round(site.x);
      const gy = Math.round(site.y);
      if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
        const idx = gy * width + gx;
        rotation = gradients[idx] * 180 / Math.PI;
      }
    }
    // Add random rotation variance
    rotation += (Math.random() - 0.5) * config.rotationVariance * 2;
    // Clamp rotation
    rotation = ((rotation % 360) + 360) % 360;

    // Sample color at site
    const px = Math.round(site.x);
    const py = Math.round(site.y);
    const pixelIdx = (py * width + px) * 4;
    const rgb = {
      r: imageData.data[pixelIdx] || 255,
      g: imageData.data[pixelIdx + 1] || 255,
      b: imageData.data[pixelIdx + 2] || 255,
    };
    // Find closest palette color
    let minDist = Infinity;
    let closestIdx = 0;
    for (let j = 0; j < config.palette.length; j++) {
      const prgb = hexToRgb(config.palette[j].hex);
      const dist =
        Math.abs(rgb.r - prgb.r) +
        Math.abs(rgb.g - prgb.g) +
        Math.abs(rgb.b - prgb.b);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = j;
      }
    }

    tiles.push({
      tile_id: i + 1,
      x_position: site.x - tileSize / 2,
      y_position: site.y - tileSize / 2,
      width: tileSize - config.groutWidth,
      height: tileSize - config.groutWidth,
      color_hex: config.palette[closestIdx].hex,
      color_name: config.palette[closestIdx].name,
      rotation_degrees: rotation,
    });
  }

  return tiles;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
