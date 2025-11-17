
import React, { useState } from 'react';
import UploadZone from './components/UploadZone';
import MosaicCanvas from './components/MosaicCanvas';
import ConfigPanel from './components/ConfigPanel';
import type { MosaicTile } from './types/mosaic';

function App() {
  const [tiles, setTiles] = useState<MosaicTile[] | null>(null);

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
          Transform your images into beautiful roman-style mosaics — scaffold
        </p>
      </header>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <UploadZone onTilesGenerated={setTiles} />
        <ConfigPanel />
        <MosaicCanvas tiles={tiles} />
      </div>
    </div>
  );
}

export default App
