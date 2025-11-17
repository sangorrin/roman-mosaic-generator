/**
 * Image processing utilities for loading and preparing images
 * See PLAN.md section "Mosaic Generation Algorithm - Phase 1: Image Preprocessing"
 */

/**
 * Loads an image file and converts it to ImageData for processing
 * @param file - The image file to load
 * @param maxWidth - Maximum width to resize to (default: 800)
 * @param maxHeight - Maximum height to resize to (default: 600)
 * @returns Promise resolving to ImageData
 */
export async function loadImage(
  file: File,
  maxWidth = 800,
  maxHeight = 600
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const aspect = width / height;
        // Resize if needed
        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / aspect);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspect);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context error'));
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const imageData = ctx.getImageData(0, 0, width, height);
          resolve(imageData);
        } catch (e) {
          reject(new Error('Failed to extract ImageData'));
        }
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes image data to fit within max dimensions while preserving aspect ratio
 * @param imageData - Source image data
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Resized ImageData
 */
export function resizeImageData(
  _imageData: ImageData,
  _maxWidth: number,
  _maxHeight: number
): ImageData {
  // TODO: Implement smart resizing
  throw new Error('Not implemented')
}
