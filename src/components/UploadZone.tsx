import React, { useRef, useState } from 'react';
import { loadImage } from '../core/imageProcessor';

function UploadZone({ onImageLoaded }: { onImageLoaded: (data: ImageData) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const imageData = await loadImage(file);
      onImageLoaded(imageData);
      // Tiles will be generated in App when imageData is set
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
    </div>
  );
}

export default UploadZone
