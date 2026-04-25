import React, { useRef, useCallback } from 'react';

const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Poppins', 'Manrope', 'DM Sans', 'Outfit', 'Plus Jakarta Sans',
  'Montserrat', 'Lato', 'Open Sans', 'Nunito', 'Raleway', 'Rubik', 'Work Sans',
  'Oswald', 'Playfair Display', 'Lora', 'Merriweather'
];

const DebouncedColorInput = ({ value, onChange, className }) => {
  const timerRef = useRef(null);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 50);
  }, [onChange]);

  return (
    <input
      type="color"
      defaultValue={value}
      onChange={handleChange}
      className={className}
    />
  );
};

const ThemeConfigPanel = ({ theme, onThemeChange }) => {
  const update = (key, value) => onThemeChange({ ...theme, [key]: value });

  return (
    <div className="cb-panel cb-panel-left">
      <div className="cb-panel-header">
        <h3 className="cb-panel-title">Theme Config</h3>
        <p className="cb-panel-subtitle">Customize your career page appearance</p>
      </div>

      <div className="cb-panel-body">
        {/* COLORS */}
        <div className="cb-config-section">
          <div className="cb-config-section-title">
            <span className="cb-config-icon">🎨</span> COLORS
          </div>

          {[
            { key: 'primaryColor', label: 'Primary' },
            { key: 'secondaryColor', label: 'Secondary' },
            { key: 'backgroundColor', label: 'Background' },
            { key: 'textColor', label: 'Text' },
          ].map(({ key, label }) => (
            <div className="cb-color-row" key={key}>
              <span className="cb-color-label">{label}</span>
              <div className="cb-color-picker-wrap">
                <DebouncedColorInput
                  value={theme[key]}
                  onChange={(val) => update(key, val)}
                  className="cb-color-input"
                />
                <span className="cb-color-hex">{theme[key]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TYPOGRAPHY */}
        <div className="cb-config-section">
          <div className="cb-config-section-title">
            <span className="cb-config-icon">T</span> TYPOGRAPHY
          </div>

          <div className="cb-field">
            <label className="cb-field-label">Font Family</label>
            <select
              value={theme.fontFamily}
              onChange={(e) => update('fontFamily', e.target.value)}
              className="cb-select"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="cb-field">
            <div className="cb-field-label-row">
              <label className="cb-field-label">Base Font Size</label>
              <span className="cb-field-value">{theme.baseFontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="20"
              value={theme.baseFontSize}
              onChange={(e) => update('baseFontSize', Number(e.target.value))}
              className="cb-range"
            />
          </div>
        </div>

        {/* SHAPE */}
        <div className="cb-config-section">
          <div className="cb-config-section-title">
            <span className="cb-config-icon">▢</span> SHAPE
          </div>
          <div className="cb-field">
            <div className="cb-field-label-row">
              <label className="cb-field-label">Border Radius</label>
              <span className="cb-field-value">{theme.borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={theme.borderRadius}
              onChange={(e) => update('borderRadius', Number(e.target.value))}
              className="cb-range"
            />
          </div>
        </div>

        {/* BUTTON STYLE */}
        <div className="cb-config-section">
          <div className="cb-config-section-title">
            <span className="cb-config-icon">✦</span> BUTTON STYLE
          </div>
          <div className="cb-toggle-group">
            {['flat', 'outline', 'shadow'].map((v) => (
              <button
                key={v}
                className={`cb-toggle-btn${theme.buttonStyle === v ? ' active' : ''}`}
                onClick={() => update('buttonStyle', v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* EFFECTS */}
        <div className="cb-config-section">
          <div className="cb-config-section-title">
            <span className="cb-config-icon">✨</span> EFFECTS
          </div>
          <div className="cb-field">
            <label className="cb-field-label">Shadow</label>
            <div className="cb-toggle-group">
              {['none', 'subtle', 'medium'].map((v) => (
                <button
                  key={v}
                  className={`cb-toggle-btn${theme.shadow === v ? ' active' : ''}`}
                  onClick={() => update('shadow', v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SPACING */}
        <div className="cb-config-section">
          <div className="cb-config-section-title">
            <span className="cb-config-icon">⊞</span> SPACING
          </div>
          <div className="cb-toggle-group">
            {['compact', 'normal', 'spacious'].map((v) => (
              <button
                key={v}
                className={`cb-toggle-btn${theme.spacing === v ? ' active' : ''}`}
                onClick={() => update('spacing', v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeConfigPanel;
