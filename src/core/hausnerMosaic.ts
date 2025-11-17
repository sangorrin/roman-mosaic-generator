import type { MosaicTile } from '../types/mosaic';
import { detectEdges } from './edgeDetector';

export interface HausnerConfig {
  numTiles: number;
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
  const { angles, magnitudes } = detectEdges(imageData);

  // 2. Initialize tile sites randomly
  const width = imageData.width;
  const height = imageData.height;
  const numTiles = config.numTiles;
  const sites: { x: number; y: number; theta: number }[] = [];
  for (let i = 0; i < numTiles; i++) {
    sites.push({
      x: Math.random() * width,
      y: Math.random() * height,
      theta: 0 // will be updated
    });
  }

  // 3. Centroidal Voronoi relaxation with rotated Manhattan distance
  const iterations = 5;
  for (let iter = 0; iter < iterations; iter++) {
    // Update orientations
    for (const site of sites) {
      if (angles) {
        const gx = Math.round(site.x);
        const gy = Math.round(site.y);
        if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
          const idx = gy * width + gx;
          site.theta = angles[idx];
        }
      }
    }

    // Compute Voronoi assignment using rotated Manhattan
    const assignment = new Uint32Array(width * height);
    const INVALID = sites.length;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let minDist = Infinity;
        let bestSite = 0;
        for (let i = 0; i < sites.length; i++) {
          const site = sites[i];
          const dx = x - site.x;
          const dy = y - site.y;
          const cos = Math.cos(site.theta);
          const sin = Math.sin(site.theta);
          const rx = dx * cos - dy * sin;
          const ry = dx * sin + dy * cos;
          const dist = Math.abs(rx) + Math.abs(ry);
          if (dist < minDist) {
            minDist = dist;
            bestSite = i;
          }
        }
        assignment[y * width + x] = bestSite;
      }
    }

    // Edge avoidance: recolor strong edge pixels to block them
    if (magnitudes) {
      let maxMag = 0;
      for (let i = 0; i < magnitudes.length; i++) {
        if (magnitudes[i] > maxMag) maxMag = magnitudes[i];
      }
      const threshold = maxMag / 4;
      for (let i = 0; i < assignment.length; i++) {
        if (magnitudes[i] > threshold) {
          assignment[i] = INVALID;
        }
      }
    }

    // Compute centroids
    const centroids = sites.map(() => ({ x: 0, y: 0, count: 0 }));
    for (let idx = 0; idx < assignment.length; idx++) {
      const siteIdx = assignment[idx];
      if (siteIdx < sites.length) {
        const y = Math.floor(idx / width);
        const x = idx % width;
        centroids[siteIdx].x += x;
        centroids[siteIdx].y += y;
        centroids[siteIdx].count++;
      }
    }
    for (let i = 0; i < sites.length; i++) {
      if (centroids[i].count > 0) {
        sites[i].x = centroids[i].x / centroids[i].count;
        sites[i].y = centroids[i].y / centroids[i].count;
      }
    }
  }

  // 4. Compute tile size
  const tileSize = Math.sqrt((width * height) / numTiles);

  // 5. Tile placement, orientation, color assignment
  const tiles: MosaicTile[] = [];
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    // Orientation from site.theta
    let rotation = site.theta * 180 / Math.PI;
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
