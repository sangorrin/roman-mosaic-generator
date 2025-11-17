/**
 * Type definitions for mosaic tile data structure
 * Tile object structure is used throughout the application and in exports
 * See PLAN.md section "Export Functionality - CSV Export" for field descriptions
 */

/**
 * Represents a single mosaic tile with position, color, and orientation
 */
export interface MosaicTile {
  /** Sequential integer identifier for the tile */
  tile_id: number

  /** X coordinate of tile's top-left corner (pixels) */
  x_position: number

  /** Y coordinate of tile's top-left corner (pixels) */
  y_position: number

  /** Width of the tile (pixels) */
  width: number

  /** Height of the tile (pixels) */
  height: number

  /** Tile color as hex code (e.g., '#F5F5DC') */
  color_hex: string

  /** Human-readable color name from palette (e.g., 'beige', 'terracotta') */
  color_name: string

  /** Rotation angle in degrees (0-359) */
  rotation_degrees: number
}
