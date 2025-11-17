
import { Delaunay } from 'd3-delaunay';
/**
 * Centroidal Voronoi relaxation for Hausner's mosaic algorithm
 * Moves sites to centroids of their Voronoi cells, optionally guided by flow field
 */

export interface Site {
  x: number;
  y: number;
}

/**
 * Performs centroidal Voronoi relaxation
 * @param sites - Initial tile sites
 * @param width - Image width
 * @param height - Image height
 * @param iterations - Number of relaxation steps
 * @returns Relaxed sites
 */
export function relaxSites(
  sites: Site[],
  width: number,
  height: number,
  iterations = 10
): Site[] {
  // TODO: Use d3-delaunay for Voronoi diagram
  // For each iteration:
  //   - Compute Voronoi diagram
  //   - Move each site to centroid of its cell
  //   - Optionally, bias movement along flow field
  // This is a stub for future implementation
    let relaxedSites = sites.map(site => ({ ...site }));
    for (let iter = 0; iter < iterations; iter++) {
      // Prepare points array for Delaunay
      const points = relaxedSites.map(s => [s.x, s.y]);
      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);
      for (let i = 0; i < relaxedSites.length; i++) {
        const cell = voronoi.cellPolygon(i);
        if (cell && cell.length > 0) {
          // Compute centroid of polygon
          let cx = 0, cy = 0, area = 0;
          for (let j = 0; j < cell.length - 1; j++) {
            const [x0, y0] = cell[j];
            const [x1, y1] = cell[j + 1];
            const a = x0 * y1 - x1 * y0;
            cx += (x0 + x1) * a;
            cy += (y0 + y1) * a;
            area += a;
          }
          area *= 0.5;
          if (area !== 0) {
            cx /= (6 * area);
            cy /= (6 * area);
            relaxedSites[i].x = Math.max(0, Math.min(width, cx));
            relaxedSites[i].y = Math.max(0, Math.min(height, cy));
          }
        }
      }
    }
    return relaxedSites;
}
