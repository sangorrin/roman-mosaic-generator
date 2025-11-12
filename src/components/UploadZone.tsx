/**
 * UploadZone component - placeholder for image upload interface
 * Will support drag-and-drop, file validation, and image preview
 * See PLAN.md section "Image Upload Interface" for implementation details
 */
function UploadZone() {
  return (
    <div style={{
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '3rem',
      textAlign: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Image</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Drag and drop an image here, or click to select
      </p>
      <p style={{ fontSize: '0.875rem', color: '#999' }}>
        Supports JPEG, PNG, WebP (max 10MB)
      </p>
    </div>
  )
}

export default UploadZone
