# Roman Mosaic Generator

A web application that transforms uploaded images into interactive roman-style mosaics with configurable tile properties and multiple export formats (CSV, SVG, JPEG).

## Quick Start

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Testing

Run the test suite:

```bash
npm run test
```

## Project Structure

- `src/components/` - React UI components (UploadZone, MosaicCanvas, ConfigPanel)
- `src/core/` - Core algorithms for image processing, edge detection, and mosaic generation
- `src/utils/` - Export utilities for CSV and SVG formats
- `src/types/` - TypeScript type definitions

## Implementation Details

For detailed information about the mosaic generation algorithms, configuration options, and export formats, see [PLAN.md](./PLAN.md).

## License

MIT
