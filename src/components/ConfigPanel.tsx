/**
 * ConfigPanel component - placeholder for mosaic configuration controls
 * Will provide sliders and options for tile size, color palette, edge detection, etc.
 * See PLAN.md section "Configuration Panel" for all parameters
 */
function ConfigPanel() {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: '#fff'
    }}>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Configuration</h3>
      <div style={{ color: '#666', fontSize: '0.875rem' }}>
        <p>• Tile Size: 10px (default)</p>
        <p>• Color Palette: Classic Roman</p>
        <p>• Edge Detection: Enabled</p>
        <p>• Rotation Variance: ±5°</p>
      </div>
    </div>
  )
}

export default ConfigPanel
