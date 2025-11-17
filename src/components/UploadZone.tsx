import { generateHausnerMosaic } from '../core/hausnerMosaic';
/**
 * UploadZone component - placeholder for image upload interface
 * Will support drag-and-drop, file validation, and image preview
 * See PLAN.md section "Image Upload Interface" for implementation details
 */

import React, { useRef, useState } from 'react';
import { loadImage } from '../core/imageProcessor';
// Expanded palette with color names
const PALETTE = [
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

function UploadZone({ onTilesGenerated }: { onTilesGenerated?: (tiles: any) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tileCount, setTileCount] = useState<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Unsupported file type.');
      return;
    }
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large (max 10MB).');
      return;
    }
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setTileCount(null);
    try {
      const imageData = await loadImage(file);
      // Edge detection is performed for Hausner's algorithm, but gradients are not used directly here
      const hausnerConfig = {
        tileSize: 10,
        palette: PALETTE,
        groutWidth: 1,
        rotationVariance: 5,
      };
      const tiles = generateHausnerMosaic(imageData, hausnerConfig);
      setTileCount(tiles.length);
      if (onTilesGenerated) onTilesGenerated(tiles);
    } catch (e) {
      setError('Failed to process image.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '3rem',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        position: 'relative',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleChange}
      />
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Image</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Drag and drop an image here, or click to select
      </p>
      <p style={{ fontSize: '0.875rem', color: '#999' }}>
        Supports JPEG, PNG, WebP (max 10MB)
      </p>
      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
      )}
      {previewUrl && (
        <div style={{ marginTop: '1rem' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
          />
        </div>
      )}
      {tileCount !== null && (
        <p style={{ marginTop: '1rem', color: '#333' }}>
          Mosaic generated: <strong>{tileCount}</strong> tiles
        </p>
      )}
    </div>
  );
}

export default UploadZone
