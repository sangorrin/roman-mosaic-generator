# Roman Mosaic Generator - Technical Plan

## Project Overview

**Objective:** Create a web application that transforms uploaded images into interactive roman-style mosaics with configurable tile properties, editing capabilities, and multiple export formats (CSV, SVG, JPEG).

***

## Architecture

### Technology Stack

**Frontend:**

- **Framework:** React 18+ with TypeScript
- **Canvas Manipulation:** Fabric.js for interactive editing
- **Image Processing:** Canvas API + Custom algorithms
- **UI Components:** Tailwind CSS + shadcn/ui
- **File Handling:** FileSaver.js for downloads

**Backend:**

- **Runtime:** Node.js with Express (lightweight API)
- **Image Processing:** Sharp library for server-side optimization
- **Alternative:** Pure client-side processing (recommended for simplicity)

**Build \& Deploy:**

- **Bundler:** Vite
- **Hosting:** Vercel, Netlify, or GitHub Pages
- **CI/CD:** GitHub Actions

***

## Core Features

### 1. Image Upload Interface

**Requirements:**

- Drag-and-drop file upload
- Accept formats: JPEG, PNG, WebP
- Max file size: 10MB
- Image preview before processing
- Mobile-responsive design

**Implementation:**

- Use HTML5 File API
- Display thumbnail with dimensions
- Validate file type and size client-side

***

### 2. Mosaic Generation Algorithm

**Phase 1: Image Preprocessing**

- Load image to canvas
- Resize to configurable max dimensions (e.g., 800x600px) for performance
- Apply edge detection (Sobel or Canny algorithm) to identify major edges

**Phase 2: Color Quantization**

- Define predefined color palette (8-16 roman mosaic colors):
    - Whites (limestone, marble)
    - Blacks (basalt, slate)
    - Reds/terracotta
    - Ochres/yellows
    - Blues (rare, lapis lazuli)
    - Greens (serpentine)
    - Browns
- Apply K-means clustering or median-cut algorithm to map image colors to palette
- Use color distance in LAB color space for perceptual accuracy

**Phase 3: Tile Grid Generation**

- Divide image into grid based on configurable tile size (default: 10x10px tiles)
- For each tile:
    - Sample dominant color (average or median)
    - Map to nearest palette color
    - Store position (x, y), color index, size

**Phase 4: Edge Alignment**

- Detect edge orientation using gradient direction
- Rotate tile orientation to follow edges (0°, 45°, 90°, 135°)
- Apply "flow field" technique where tiles align with image contours
- Implement **anisotropic tiling** for curved features

**Phase 5: Artistic Adjustments**

- Add slight random rotation variance (±5°) for organic look
- Implement grout spacing (1-2px gaps between tiles)
- Optional: Vary tile sizes for emphasis areas (larger tiles in backgrounds)

***

### 3. Interactive Editing Interface

**Canvas Controls:**

- Pan: Click + drag to move viewport
- Zoom: Mouse wheel or pinch gestures (50%-400%)
- Grid overlay toggle for alignment reference

**Tile Editing Tools:**

- **Select tool:** Click tile to select (highlight border)
- **Color picker:** Change selected tile to different palette color
- **Rotate tool:** Rotate tile in 15° increments
- **Size adjust:** Scale individual tile (small/medium/large presets)
- **Bulk operations:** Shift+click to multi-select, apply changes to group

**Undo/Redo System:**

- Implement command pattern with action history
- Max 50 steps in history

***

### 4. Export Functionality

**CSV Export**

**Format specification:**

```csv
tile_id,x_position,y_position,width,height,color_hex,color_name,rotation_degrees
1,0,0,10,10,#F5F5DC,beige,0
2,10,0,10,10,#8B4513,brown,45
```

**Fields:**

- `tile_id`: Sequential integer
- `x_position`, `y_position`: Top-left corner coordinates (pixels)
- `width`, `height`: Tile dimensions (pixels)
- `color_hex`: Hex color code
- `color_name`: Human-readable color from palette
- `rotation_degrees`: Tile rotation (0-359°)

**SVG Export**

**Requirements:**

```
- Each tile as `<rect>` or `<polygon>` element
```

- Grouped by color for easier laser cutting/CNC processing
- Include metadata (original image dimensions, palette used)
- Preserve exact pixel positions for reconstruction

**Implementation:**

```javascript
// Pseudo-code structure
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .tile-beige { fill: #F5F5DC; }
      .tile-brown { fill: #8B4513; }
    </style>
  </defs>
  <g id="beige-tiles">
    <rect x="0" y="0" width="10" height="10" class="tile-beige" transform="rotate(0 5 5)"/>
  </g>
  <g id="brown-tiles">
    <rect x="10" y="0" width="10" height="10" class="tile-brown" transform="rotate(45 15 5)"/>
  </g>
</svg>
```

**JPEG Export**

**Requirements:**

- Render final mosaic to hidden canvas
- Apply anti-aliasing for smooth edges
- Export at configurable resolution (1x, 2x, 4x original)
- Quality setting (80-95%)

**Implementation:**

- Use `canvas.toBlob()` with JPEG mime type
- Trigger download via Blob URL

***

## Configuration Panel

**User-adjustable Parameters:**


| Parameter | Type | Default | Range | Description |
| :-- | :-- | :-- | :-- | :-- |
| Tile Size | Number | 10 | 5-50px | Base dimension of square tiles |
| Color Palette | Select | Classic | 5 presets | Roman, Byzantine, Pompeii, Ravenna, Custom |
| Edge Detection | Toggle | On | - | Enable edge-aligned tiling |
| Rotation Variance | Number | 5 | 0-15° | Random rotation for organic feel |
| Grout Width | Number | 1 | 0-5px | Spacing between tiles |
| Tile Shape | Select | Square | Square/Hexagon | Tesserae geometry |

**Presets:**

- **High Detail:** Tile size 5px, edge detection on
- **Balanced:** Tile size 10px, 5° variance
- **Artistic:** Tile size 15px, 10° variance, varied sizes

***

## File Structure

```
mosaic-generator/
├── public/
│   ├── index.html
│   └── sample-images/
├── src/
│   ├── components/
│   │   ├── UploadZone.tsx
│   │   ├── ConfigPanel.tsx
│   │   ├── MosaicCanvas.tsx
│   │   ├── EditToolbar.tsx
│   │   └── ExportModal.tsx
│   ├── core/
│   │   ├── imageProcessor.ts
│   │   ├── mosaicGenerator.ts
│   │   ├── colorQuantizer.ts
│   │   └── edgeDetector.ts
│   ├── utils/
│   │   ├── exportCSV.ts
│   │   ├── exportSVG.ts
│   │   ├── exportJPEG.ts
│   │   └── colorPalettes.ts
│   ├── types/
│   │   └── mosaic.d.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```


***

## Implementation Phases

### Phase 1: MVP (Week 1-2)

- Basic upload interface
- Simple grid-based mosaic (no edge detection)
- Fixed color palette (8 colors)
- Square tiles only
- Basic CSV and JPEG export
- No editing tools


### Phase 2: Core Features (Week 3-4)

- Edge detection algorithm
- Tile rotation alignment
- Interactive canvas with Fabric.js
- SVG export
- Configuration panel
- Color picker tool


### Phase 3: Polish (Week 5-6)

- Advanced editing tools (multi-select, undo/redo)
- Multiple color palettes
- Tile size variance
- Performance optimization (Web Workers for processing)
- Mobile responsiveness
- Tutorial/onboarding


### Phase 4: Enhancements (Optional)

- Custom color palette creator
- Batch processing
- Gallery of generated mosaics
- Share functionality
- Hexagonal tile option
- 3D preview mode

***

## Key Algorithms

### Edge Detection (Sobel Operator)

**Purpose:** Identify major contours to align tile orientation.[^1]

```typescript
function detectEdges(imageData: ImageData): Float32Array {
  const width = imageData.width;
  const height = imageData.height;
  const gradients = new Float32Array(width * height);
  
  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      // Apply convolution
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = (imageData.data[idx] + imageData.data[idx+1] + imageData.data[idx+2]) / 3;
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          gx += gray * sobelX[kernelIdx];
          gy += gray * sobelY[kernelIdx];
        }
      }
      
      // Gradient magnitude and direction
      gradients[y * width + x] = Math.atan2(gy, gx);
    }
  }
  
  return gradients;
}
```


### Color Quantization (K-Means)

**Purpose:** Map image colors to limited mosaic palette.[^2]

```typescript
function quantizeColors(imageData: ImageData, palette: string[]): Uint8Array {
  const pixels = imageData.data;
  const result = new Uint8Array(pixels.length / 4);
  
  // Convert palette to LAB color space for perceptual matching
  const paletteLAB = palette.map(hex => rgbToLab(hexToRgb(hex)));
  
  for (let i = 0; i < pixels.length; i += 4) {
    const rgb = { r: pixels[i], g: pixels[i+1], b: pixels[i+2] };
    const lab = rgbToLab(rgb);
    
    // Find nearest palette color
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
```


### Tile Alignment

**Purpose:** Rotate tiles to follow image contours.[^3]

```typescript
function alignTileToEdge(gradient: number): number {
  // Convert gradient angle to tile rotation
  // Snap to nearest 45° increment
  const degrees = (gradient * 180 / Math.PI + 360) % 360;
  return Math.round(degrees / 45) * 45;
}
```


***

## Performance Considerations

**Optimization Strategies:**

- Use Web Workers for heavy processing (edge detection, quantization)
- Implement progressive rendering (show low-res preview first)
- Virtualize canvas for large images (only render visible tiles)
- Cache processed tiles to avoid recomputation
- Debounce interactive adjustments
- Limit max image dimensions (downscale if necessary)

**Target Performance:**

- Process 800x600 image in <3 seconds
- Interactive editing at 60 FPS
- Export under 1 second

***

## Testing Strategy

**Unit Tests:**

- Color quantization accuracy
- Edge detection correctness
- CSV format validation
- SVG structure validation

**Integration Tests:**

- End-to-end upload → process → export flow
- Canvas interaction events
- File download triggers

**Visual Regression:**

- Compare generated mosaics against reference images
- Ensure consistent output across browsers

***

## Dependencies

**Package.json (estimated):**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "fabric": "^5.3.0",
    "file-saver": "^2.0.5",
    "chroma-js": "^2.4.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/file-saver": "^2.0.5",
    "typescript": "^5.0.0",
    "vite": "^4.3.0",
    "tailwindcss": "^3.3.0",
    "vitest": "^0.31.0"
  }
}
```


***

## Future Enhancements

- **AI-assisted tiling:** Use ML models to optimize tile placement
- **Physical mosaic calculator:** Estimate material costs and quantities
- **Augmented reality preview:** Visualize mosaic on walls via phone camera
- **Collaborative editing:** Multi-user sessions
- **Time-lapse export:** Video showing mosaic construction process
- **Pattern library:** Save and reuse tiling patterns

***

## Deployment

**Steps:**

1. Build optimized production bundle: `npm run build`
2. Deploy to Vercel: `vercel deploy`
3. Configure custom domain (optional)
4. Enable analytics (Plausible/Google Analytics)
5. Set up error tracking (Sentry)

**Environment Variables:**

- `VITE_MAX_IMAGE_SIZE`: 10485760 (10MB)
- `VITE_MAX_DIMENSION`: 2048px
- `VITE_API_URL`: (if using backend)

***

## Documentation

**README.md should include:**

- Project description with demo GIF
- Installation instructions
- Usage guide with screenshots
- Configuration options
- Export format specifications
- Contributing guidelines
- License (MIT recommended)

**Additional docs:**

- `ALGORITHM.md`: Detailed explanation of mosaic generation
- `API.md`: Export format specifications
- `CONTRIBUTING.md`: Development setup and guidelines

***

This plan provides a comprehensive blueprint for building your roman mosaic generator. The modular structure allows for incremental development through GitHub Copilot, starting with the MVP and progressively adding advanced features.[^4][^5][^6][^7]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.nature.com/articles/s41598-024-74567-2

[^2]: https://legacy.imagemagick.org/Usage/quantize/

[^3]: https://theancienthome.com/blogs/blog-and-news/how-to-make-a-roman-mosaic

[^4]: https://www.jigidi.com/create-custom-jigsaw-puzzle/

[^5]: https://itch.io/t/3960001/trends-in-puzzle-game-development-whats-hot-in-2024

[^6]: https://blog.filestack.com/real-time-javascript-image-editing-best-libraries-performance/

[^7]: https://www.gorillasun.de/blog/svg-export-for-p5-and-js-rendering-context/

[^8]: image.jpg

[^9]: https://www.jigidi.com

[^10]: https://www.instagram.com/reel/DQ1qHDeEfrs/

[^11]: https://www.jigidi.com/a/custom-jigsaw-puzzles/

[^12]: https://www.reddit.com/r/Jigsawpuzzles/comments/155uler/ive_been_creating_jigsaw_puzzles_at_jigidi_dot/

[^13]: https://www.slideshare.net/slideshow/image-mosaicing-83645109/83645109

[^14]: https://www.jigidi.com/a/creating-puzzles/

[^15]: https://stackoverflow.com/questions/27526729/algorithm-design-image-quantization-for-most-prominent-colors

