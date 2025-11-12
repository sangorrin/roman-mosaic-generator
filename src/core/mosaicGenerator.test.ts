/**
 * Unit tests for mosaic tile alignment algorithm
 * Validates that tiles snap to 45° increments for edge alignment
 */

import { describe, it, expect } from 'vitest'
import { alignTileToEdge } from '../core/mosaicGenerator'

describe('alignTileToEdge', () => {
  it('should snap 0 radians to 0 degrees', () => {
    expect(alignTileToEdge(0)).toBe(0)
  })

  it('should snap π/4 radians (45°) to 45 degrees', () => {
    const piOver4 = Math.PI / 4
    expect(alignTileToEdge(piOver4)).toBe(45)
  })

  it('should snap π/2 radians (90°) to 90 degrees', () => {
    const piOver2 = Math.PI / 2
    expect(alignTileToEdge(piOver2)).toBe(90)
  })

  it('should snap 3π/4 radians (135°) to 135 degrees', () => {
    const threePiOver4 = (3 * Math.PI) / 4
    expect(alignTileToEdge(threePiOver4)).toBe(135)
  })

  it('should snap π radians (180°) to 180 degrees', () => {
    expect(alignTileToEdge(Math.PI)).toBe(180)
  })

  it('should snap -π/4 radians (-45°) to 315 degrees', () => {
    const negPiOver4 = -Math.PI / 4
    expect(alignTileToEdge(negPiOver4)).toBe(315)
  })

  it('should snap angles between increments to nearest 45° step', () => {
    // Test angle between 0° and 45° -> should snap to nearest
    const angle1 = Math.PI / 8 // 22.5° -> rounds to 45° (0.5 rounds up)
    expect(alignTileToEdge(angle1)).toBe(45)

    const angle2 = (3 * Math.PI) / 8 // 67.5° -> rounds to 90° (1.5 rounds up)
    expect(alignTileToEdge(angle2)).toBe(90)

    // Test angles closer to lower bound
    const angle3 = Math.PI / 10 // 18° -> should snap to 0°
    expect(alignTileToEdge(angle3)).toBe(0)

    const angle4 = (2.5 * Math.PI) / 8 // ~56.25° -> should snap to 45°
    expect(alignTileToEdge(angle4)).toBe(45)
  })

  it('should handle full circle (2π) as 0 degrees', () => {
    expect(alignTileToEdge(2 * Math.PI)).toBe(0)
  })

  it('should handle negative angles correctly', () => {
    const negPiOver2 = -Math.PI / 2 // -90° -> should be 270°
    expect(alignTileToEdge(negPiOver2)).toBe(270)
  })
})
