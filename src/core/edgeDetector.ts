/**
 * Edge detection algorithms for identifying contours in images
 * See PLAN.md section "Key Algorithms - Edge Detection (Sobel Operator)"
 */

/**
 * Applies Sobel edge detection to identify major contours
 * Returns gradient direction and magnitude at each pixel for tile alignment
 * @param imageData - Source image data
 * @returns Object with angles and magnitudes Float32Arrays
 */
export function detectEdges(imageData: ImageData): { angles: Float32Array, magnitudes: Float32Array } {
  const width = imageData.width
  const height = imageData.height
  const angles = new Float32Array(width * height)
  const magnitudes = new Float32Array(width * height)

  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0,
        gy = 0

      // Apply convolution
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const gray =
            (imageData.data[idx] +
              imageData.data[idx + 1] +
              imageData.data[idx + 2]) /
            3
          const kernelIdx = (ky + 1) * 3 + (kx + 1)
          gx += gray * sobelX[kernelIdx]
          gy += gray * sobelY[kernelIdx]
        }
      }

      // Gradient magnitude and direction
      const mag = Math.sqrt(gx * gx + gy * gy)
      magnitudes[y * width + x] = mag
      angles[y * width + x] = Math.atan2(gy, gx)
    }
  }

  return { angles, magnitudes }
}
