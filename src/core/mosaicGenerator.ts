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
  palette: string[],
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
      // TODO: Sample color and gradient at this position
      // TODO: Apply alignTileToEdge for rotation
      // TODO: Add random variance (±5°) for organic feel

      tiles.push({
        tile_id: tileId++,
        x_position: x,
        y_position: y,
        width: tileSize,
        height: tileSize,
        color_hex: palette[0] || '#F5F5DC',
        color_name: 'beige',
        rotation_degrees: 0,
      })
    }
  }

  return tiles
}
