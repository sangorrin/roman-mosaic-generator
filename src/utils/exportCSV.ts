/**
 * CSV export utility for mosaic tile data
 * See PLAN.md section "Export Functionality - CSV Export"
 */

import type { MosaicTile } from '../types/mosaic'

/**
 * Exports mosaic tiles to CSV format
 * Format: tile_id,x_position,y_position,width,height,color_hex,color_name,rotation_degrees
 * @param tiles - Array of mosaic tiles
 * @param filename - Output filename (default: 'mosaic.csv')
 * @returns CSV content as string
 */
export function exportToCSV(
  tiles: MosaicTile[],
  _filename = 'mosaic.csv'
): string {
  // CSV header - order is important for downstream tooling
  const header =
    'tile_id,x_position,y_position,width,height,color_hex,color_name,rotation_degrees'

  // Convert tiles to CSV rows
  const rows = tiles.map((tile) => {
    return [
      tile.tile_id,
      tile.x_position,
      tile.y_position,
      tile.width,
      tile.height,
      tile.color_hex,
      tile.color_name,
      tile.rotation_degrees,
    ].join(',')
  })

  return [header, ...rows].join('\n')
}

/**
 * Downloads CSV file to user's computer
 * @param tiles - Array of mosaic tiles
 * @param filename - Output filename
 */
export function downloadCSV(tiles: MosaicTile[], filename = 'mosaic.csv'): void {
  const csvContent = exportToCSV(tiles, filename)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
