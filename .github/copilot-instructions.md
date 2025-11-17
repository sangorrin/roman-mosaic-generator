### Quick context

This repository implements a web-based "roman mosaic" generator (front-end heavy). The canonical design and implementation plan is in `PLAN.md` (algorithms, file layout, and export formats). At the moment the repo contains only documentation (`README.md`, `PLAN.md`, `LICENSE`) and the code skeleton described in the plan is expected under `src/` when implemented.

### Big picture (what to know first)

- Frontend-first app: React + TypeScript + Vite (planned). Main responsibilities: image upload, tile/grid generation, interactive editing (Fabric.js), and exports (CSV, SVG, JPEG).

- Core algorithm is Hausner's decorative mosaic (SIGGRAPH 2001):
  - Flow field computation from image edges
  - Centroidal Voronoi relaxation for tile placement
  - Tile orientation follows flow field
  - Color quantization and palette mapping
- Exports follow strict formats. CSV column order is important for downstream tooling: `tile_id,x_position,y_position,width,height,color_hex,color_name,rotation_degrees` (see `PLAN.md` CSV example).

### Files and locations to inspect or add (plan-driven)


- `src/core/imageProcessor.ts` — image load, resize, basic canvas helpers
- `src/core/edgeDetector.ts` — edge logic for flow field computation
- `src/core/colorQuantizer.ts` — palette mapping (LAB color comparisons are expected)
- `src/core/mosaicGenerator.ts` — Hausner mosaic generation and tile alignment logic
- `src/components/MosaicCanvas.tsx` — Fabric.js wrapper and editing tools
- `src/utils/exportCSV.ts`, `src/utils/exportSVG.ts`, `src/utils/exportJPEG.ts` — exporters; follow CSV and SVG structures in `PLAN.md`

If these files are missing, follow the `PLAN.md` file-structure subsection as the canonical layout.

### Project-specific conventions and parameters (use these exactly)

- Default tile size: 10px (configurable). Many algorithms assume tiles of this base size.
- Default palette length: 8–16 colors (map with perceptual color distance in LAB space).
- Max upload size: 10MB; images should be downscaled to a working resolution (example: 800x600) before heavy processing.
- Tile rotation snaps to 45° increments when aligning to edges (see `alignTileToEdge` example in `PLAN.md`).
- Rotation variance for organic feel: ±5° default; grout width default 1px.

These values appear across the plan and test data; changing them affects both rendering and export outputs.

### Developer workflows (what works now / what to check)

- This repo currently lacks a package manifest; infer the typical commands from the stack described in `PLAN.md`:
  - `npm install` (or `pnpm`/`yarn`) to install deps
  - `npm run dev` — start Vite dev server (inspect browser & console)
  - `npm run build` — create production bundle

- When those scripts exist, prefer `npm ci` in CI for reproducible installs.
- For CPU-heavy image work, use Web Workers (recommended in `PLAN.md`) and test with small images first to speed iteration.

### Integration points & external deps to be aware of

- Fabric.js — interactive canvas and selection tools; editing-state is kept in the canvas object model.
- FileSaver.js — client-side downloads for blobs (JPEG/CSV/SVG).
- Sharp — optional server-side image processing if a Node backend is added.
- Web Workers — recommended for `edgeDetector` and `colorQuantizer` to keep UI thread responsive.

### How to modify algorithms safely


- Start with Hausner's algorithm reference: implement flow field, centroidal Voronoi relaxation, and tile orientation in `src/core/mosaicGenerator.ts`. Add unit tests for core steps.
- Preserve data contracts: the mosaic generator should output a tile list of objects with `{tile_id, x, y, width, height, color_hex, color_name, rotation_degrees}` to ensure exporters continue to work.

### Quick checks for PR reviewers / AI agents

- Confirm CSV exporter produces columns in the exact order described above.
- Verify exported SVG groups tiles by color for easier downstream processing.
- Ensure image resizing happens before heavy processing and that uploads >10MB are rejected client-side.

### When something is missing

- If `package.json`, `src/` files, or CI scripts are not present, follow `PLAN.md` structure when adding them. Note the repository currently documents intended structure — not an implemented codebase.

### Final notes

This file is intentionally concise. For algorithm details, edge cases, and implementation snippets, consult `PLAN.md`. Ask for clarification if you run into an area where the plan and implementation must be reconciled (e.g., whether to perform quantization on the client vs server). After you review this, I can expand examples or add quick unit-test templates for the core functions.
