/**
 * ConfigPanel component - provides mosaic configuration controls
 * Allows setting number of tiles, grout width, rotation variance
 */

interface Config {
  numTiles: number;
  groutWidth: number;
  rotationVariance: number;
}

interface ConfigPanelProps {
  config: Config;
  onConfigChange: (config: Config) => void;
}

function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const handleChange = (key: keyof Config, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: '#fff'
    }}>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Configuration</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Number of Tiles: {config.numTiles}
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={config.numTiles}
            onChange={(e) => handleChange('numTiles', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Grout Width: {config.groutWidth}px
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={config.groutWidth}
            onChange={(e) => handleChange('groutWidth', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Rotation Variance: ±{config.rotationVariance}°
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={config.rotationVariance}
            onChange={(e) => handleChange('rotationVariance', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>
    </div>
  );
}

export default ConfigPanel;
