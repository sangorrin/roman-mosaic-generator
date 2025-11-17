/**
 * Mosaic tile generation and alignment logic
 * See PLAN.md sections "Mosaic Generation Algorithm" and "Key Algorithms - Tile Alignment"
 */

import type { MosaicTile } from '../types/mosaic'

/**
 * Aligns a tile rotation to follow edge contours
 * Snaps gradient angle to nearest 45° increment
 * @param gradient - Edge gradient angle in radians
 * @returns Rotation angle in degrees (0, 45, 90, 135, 180, 225, 270, 315)
 */
export function alignTileToEdge(gradient: number): number {
  // Convert gradient angle to tile rotation
  // Snap to nearest 45° increment
  const degrees = ((gradient * 180) / Math.PI + 360) % 360
  return Math.round(degrees / 45) * 45
}

/**
 * Generates mosaic tiles from processed image data
 * @param imageData - Source image data
 * @param gradients - Edge gradient data from edge detection
 * @param paletteIndices - Color palette indices for each pixel
 * @param palette - Color palette as hex strings
 * @param tileSize - Size of each tile in pixels (default: 10)
 * @returns Array of mosaic tiles with position, color, and rotation
 */
export function generateMosaic(
  imageData: ImageData,
  _gradients: Float32Array,
  _paletteIndices: Uint8Array,
  palette: { hex: string; name: string }[],
  tileSize = 10
): MosaicTile[] {
  const tiles: MosaicTile[] = []
  const width = imageData.width
  const height = imageData.height

  let tileId = 1

  // TODO: Implement tile grid generation
  // - Divide image into grid based on tileSize
  // - For each tile, sample dominant color and edge orientation
  // - Create MosaicTile objects with proper rotation

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      // Sample dominant palette index in tile region
      const colorCounts = new Array(palette.length).fill(0);
      let gradientSum = 0;
      let gradientMagSum = 0;
      let pixelCount = 0;
      for (let ty = y; ty < Math.min(y + tileSize, height); ty++) {
        for (let tx = x; tx < Math.min(x + tileSize, width); tx++) {
          const idx = ty * width + tx;
          const paletteIdx = _paletteIndices[idx];
          colorCounts[paletteIdx]++;
          const grad = _gradients[idx];
          gradientSum += grad;
          gradientMagSum += Math.abs(grad);
          pixelCount++;
        }
      }
      // Find most frequent palette index
      let dominantIdx = 0;
      let maxCount = 0;
      for (let i = 0; i < colorCounts.length; i++) {
        if (colorCounts[i] > maxCount) {
          maxCount = colorCounts[i];
          dominantIdx = i;
        }
      }
      // Average gradient for tile
      const avgGradient = pixelCount > 0 ? gradientSum / pixelCount : 0;
      const avgGradientMag = pixelCount > 0 ? gradientMagSum / pixelCount : 0;
      // Only rotate if edge magnitude is strong
      let rotation = 0;
      if (avgGradientMag > 0.5) { // higher threshold for stronger edges
        rotation = alignTileToEdge(avgGradient);
        rotation += (Math.random() - 0.5) * 10;
        // Clamp rotation to [0, 359]
        rotation = ((rotation % 360) + 360) % 360;
      } else {
        rotation = 0; // no rotation in flat regions
      }

      tiles.push({
        tile_id: tileId++,
        x_position: x,
        y_position: y,
        width: tileSize,
        height: tileSize,
        color_hex: palette[dominantIdx].hex || '#F5F5DC',
        color_name: palette[dominantIdx].name || 'color',
        rotation_degrees: rotation,
      });
    }
  }

  return tiles
}
