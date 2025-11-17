/**
 * Color quantization for mapping images to limited mosaic palettes
 * See PLAN.md section "Key Algorithms - Color Quantization (K-Means)"
 */

/**
 * Maps image colors to a predefined palette using perceptual color distance
 * @param imageData - Source image data
 * @param palette - Array of hex color strings (e.g., ['#F5F5DC', '#8B4513'])
 * @returns Uint8Array of palette indices for each pixel
 */
export function quantizeColors(
  imageData: ImageData,
  palette: string[]
): Uint8Array {
  const pixels = imageData.data;
  const result = new Uint8Array(pixels.length / 4);

  // Convert palette to LAB color space for perceptual matching
  const paletteLAB = palette.map(hex => rgbToLab(hexToRgb(hex)));

  for (let i = 0; i < pixels.length; i += 4) {
    const rgb = { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] };
    const lab = rgbToLab(rgb);
    let minDist = Infinity;
    let closestIdx = 0;
    for (let j = 0; j < paletteLAB.length; j++) {
      const dist = colorDistance(lab, paletteLAB[j]);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = j;
      }
    }
    result[i / 4] = closestIdx;
  }

  return result;
}

/**
 * Converts hex color to RGB
 * @param hex - Hex color string (e.g., '#F5F5DC')
 * @returns RGB object {r, g, b}
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

/**
 * Converts RGB to LAB color space for perceptual color distance
 * @param rgb - RGB color object
 * @returns LAB color object {l, a, b}
 */
export function rgbToLab(rgb: {
  r: number;
  g: number;
  b: number;
}): { l: number; a: number; b: number } {
  // Convert RGB [0,255] to sRGB [0,1]
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // sRGB to linear RGB
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Linear RGB to XYZ
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  // Normalize for D65 white point
  const X = x / 0.95047;
  const Y = y / 1.00000;
  const Z = z / 1.08883;

  // XYZ to LAB
  function f(t: number) {
    return t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t) + (16 / 116);
  }
  const l = (116 * f(Y)) - 16;
  const a = 500 * (f(X) - f(Y));
  const b_ = 200 * (f(Y) - f(Z));
  return { l, a, b: b_ };
}

/**
 * Calculates Euclidean distance between two LAB colors
 */
function colorDistance(lab1: { l: number; a: number; b: number }, lab2: { l: number; a: number; b: number }): number {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
}
