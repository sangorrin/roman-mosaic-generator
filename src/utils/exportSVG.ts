/**
 * SVG export utility for mosaic visualization and fabrication
 * See PLAN.md section "Export Functionality - SVG Export"
 */

import type { MosaicTile } from '../types/mosaic'

/**
 * Exports mosaic tiles to SVG format
 * Groups tiles by color for easier laser cutting/CNC processing
 * @param tiles - Array of mosaic tiles
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @returns SVG content as string
 */
export function exportToSVG(
  tiles: MosaicTile[],
  width: number,
  height: number
): string {
  // Group tiles by color
  const colorGroups = new Map<string, MosaicTile[]>()

  tiles.forEach((tile) => {
    const existing = colorGroups.get(tile.color_hex) || []
    existing.push(tile)
    colorGroups.set(tile.color_hex, existing)
  })

  // Generate CSS for each color
  const styles = Array.from(colorGroups.keys())
    .map((color, idx) => {
      const className = `tile-${idx}`
      return `.${className} { fill: ${color}; }`
    })
    .join('\n      ')

  // Generate SVG groups for each color
  const groups = Array.from(colorGroups.entries())
    .map(([color, groupTiles], idx) => {
      const className = `tile-${idx}`
      const rects = groupTiles
        .map((tile) => {
          const cx = tile.x_position + tile.width / 2
          const cy = tile.y_position + tile.height / 2
          return `    <rect x="${tile.x_position}" y="${tile.y_position}" width="${tile.width}" height="${tile.height}" class="${className}" transform="rotate(${tile.rotation_degrees} ${cx} ${cy})"/>`
        })
        .join('\n')

      return `  <g id="color-group-${idx}" data-color="${color}" data-color-name="${groupTiles[0]?.color_name || 'unknown'}">\n${rects}\n  </g>`
    })
    .join('\n')

  // Build complete SVG
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      ${styles}
    </style>
  </defs>
${groups}
</svg>`
}

/**
 * Downloads SVG file to user's computer
 * @param tiles - Array of mosaic tiles
 * @param width - Canvas width
 * @param height - Canvas height
 * @param filename - Output filename
 */
export function downloadSVG(
  tiles: MosaicTile[],
  width: number,
  height: number,
  filename = 'mosaic.svg'
): void {
  const svgContent = exportToSVG(tiles, width, height)
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
