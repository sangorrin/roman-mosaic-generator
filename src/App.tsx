
import { useState, useEffect } from 'react';
import UploadZone from './components/UploadZone';
import MosaicCanvas from './components/MosaicCanvas';
import ConfigPanel from './components/ConfigPanel';
import { generateHausnerMosaic } from './core/hausnerMosaic';
import type { MosaicTile } from './types/mosaic';

interface Config {
  numTiles: number;
  groutWidth: number;
  rotationVariance: number;
}

function App() {
  const [tiles, setTiles] = useState<MosaicTile[] | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [config, setConfig] = useState<Config>({
    numTiles: 200,
    groutWidth: 1,
    rotationVariance: 1,
  });

  const generateTiles = () => {
    if (!imageData) return;
    const palette = [
      { hex: '#F5F5DC', name: 'beige' },
      { hex: '#8B4513', name: 'brown' },
      { hex: '#A9A9A9', name: 'gray' },
      { hex: '#FFD700', name: 'yellow' },
      { hex: '#4682B4', name: 'blue' },
      { hex: '#228B22', name: 'green' },
      { hex: '#000000', name: 'black' },
      { hex: '#FF6347', name: 'red' },
      { hex: '#FFF8DC', name: 'ivory' },
      { hex: '#C0C0C0', name: 'silver' },
      { hex: '#B22222', name: 'firebrick' },
      { hex: '#D2B48C', name: 'tan' },
      { hex: '#8FBC8F', name: 'sage' },
      { hex: '#2F4F4F', name: 'slate' },
      { hex: '#E9967A', name: 'terracotta' },
      { hex: '#DAA520', name: 'ochre' },
    ];
    const hausnerConfig = { ...config, palette };
    const newTiles = generateHausnerMosaic(imageData, hausnerConfig);
    setTiles(newTiles);
  };

  useEffect(() => {
    generateTiles();
  }, [config, imageData]);

  const handleImageLoaded = (data: ImageData) => {
    setImageData(data);
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Roman Mosaic Generator
        </h1>
        <p style={{ color: '#666' }}>
          Transform your images into beautiful roman-style mosaics — Hausner's algorithm
        </p>
      </header>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <UploadZone onImageLoaded={handleImageLoaded} />
        <ConfigPanel config={config} onConfigChange={setConfig} />
        <MosaicCanvas tiles={tiles} imageData={imageData} />
      </div>
    </div>
  );
}

export default App
