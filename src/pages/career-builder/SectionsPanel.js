import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faTrash,
  faPlus,
  faEye,
  faEyeSlash,
  faGripVertical
} from '@fortawesome/free-solid-svg-icons';
import { materialToFA } from '@/utils/icons';
import { useUploadFileMutation } from '@/apis/apis';
import toastMessage from '@/utils/toastMessage';

const ICON_KEYS = Object.keys(materialToFA).sort();

const SOCIAL_ICON_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'github', label: 'GitHub' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'discord', label: 'Discord' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'threads', label: 'Threads' },
];

const SECTION_META = {
  header: { icon: '🏠', label: 'Header' },
  HERO: { icon: '✦', label: 'Hero Banner' },
  ABOUT: { icon: '💬', label: 'About Us' },
  EVP: { icon: '❤️', label: 'Why Join Us (EVP)' },
  AWARDS: { icon: '🏆', label: 'Awards' },
  JOBS: { icon: '💼', label: 'Featured Jobs' },
  LIFE_AT_CO: { icon: '📸', label: 'Life at Company' },
  GALLERY: { icon: '🖼', label: 'Gallery' },
  PROCESS: { icon: '📋', label: 'Hiring Process' },
  FAQ: { icon: '❓', label: 'FAQ' },
  CTA_FOOTER: { icon: '📣', label: 'Call to Action' },
  footer: { icon: '🔗', label: 'Footer' },
};

// --- Mini Editor Components ---

const ImageField = ({ label, value, onChange }) => {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastMessage.error('Please upload an image file');
      return;
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('files', file);
      const response = await uploadFile(formDataUpload).unwrap();
      const downloadUrl = response[0]?.downloadUrl || response?.downloadUrl;
      if (downloadUrl) {
        onChange(downloadUrl);
      }
    } catch {
      toastMessage.error('Failed to upload image');
    }
  };

  return (
    <div className="cb-field">
      <label className="cb-field-label">{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          className="cb-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL..."
          style={{ flex: 1 }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button
          className="cb-btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          style={{ padding: '6px 10px', fontSize: '11px', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {isLoading ? '...' : 'Upload'}
        </button>
      </div>
      {value && <img src={value} alt="Preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: '100px', objectFit: 'contain', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} />}
    </div>
  );
};

const ColorField = ({ label, value, onChange }) => {
  return (
    <div className="cb-field">
      <label className="cb-field-label">{label}</label>
      <div className="cb-color-row" style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="cb-color-label" style={{ color: '#e2e4e9', fontSize: '12px' }}>Pick Color</span>
        <div className="cb-color-picker-wrap">
          <input
            type="color"
            value={value || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="cb-color-input"
          />
          <span className="cb-color-hex">{value || '#ffffff'}</span>
          {value && (
            <button
              className="cb-mini-btn danger"
              onClick={() => onChange('')}
              style={{ padding: '2px 6px', marginLeft: '4px' }}
              title="Reset to default"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StringField = ({ label, value, onChange, placeholder, multiline = false }) => {
  const [val, setVal] = useState(value || '');

  useEffect(() => {
    setVal(value || '');
  }, [value]);

  const handleChange = (e) => {
    setVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="cb-field">
      <label className="cb-field-label">{label}</label>
      {multiline ? (
        <textarea
          className="cb-input"
          value={val}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          type="text"
          className="cb-input"
          value={val}
          onChange={handleChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

const VisibilityToggle = ({ label, isVisible, onChange }) => {
  return (
    <div className="cb-field-label-row" style={{ marginBottom: 12 }}>
      <label className="cb-field-label" style={{ margin: 0 }}>{label}</label>
      <button
        className="cb-mini-btn"
        onClick={() => onChange(!isVisible)}
        title={isVisible !== false ? "Hide element" : "Show element"}
        style={{ color: isVisible !== false ? '#4ade80' : '#9ca3af' }}
      >
        <FontAwesomeIcon icon={isVisible !== false ? faEye : faEyeSlash} />
      </button>
    </div>
  );
};

const ArrayEditor = ({ items = [], onChange, schema, renderItemSummary, optionsMap }) => {
  const handleAdd = () => {
    const newItem = { ...schema };
    onChange([...items, newItem]);
  };

  const handleUpdate = (index, key, val) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: val };
    onChange(newItems);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };

  // Move up/down
  const handleMove = (index, dir) => {
    if (index + dir < 0 || index + dir >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + dir];
    newItems[index + dir] = temp;
    onChange(newItems);
  };

  return (
    <div className="cb-array-editor">
      {items.map((item, idx) => (
        <div key={idx} className="cb-array-item">
          <div className="cb-array-item-header">
            <span style={{ fontSize: 12, fontWeight: 600 }}>{renderItemSummary(item, idx)}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="cb-mini-btn" onClick={() => handleMove(idx, -1)} disabled={idx === 0}>↑</button>
              <button className="cb-mini-btn" onClick={() => handleMove(idx, 1)} disabled={idx === items.length - 1}>↓</button>
              <button className="cb-mini-btn danger" onClick={() => handleDelete(idx)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
          <div className="cb-array-item-body">
            {Object.keys(schema).map((key) => {
              if (optionsMap && optionsMap[key]) {
                return (
                  <div key={key} className="cb-field">
                    <label className="cb-field-label">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</label>
                    <select
                      className="cb-input cb-select"
                      value={item[key] || ''}
                      onChange={(e) => handleUpdate(idx, key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {optionsMap[key].map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (key === 'isVisible') {
                return (
                  <VisibilityToggle
                    key={key}
                    label="Visible"
                    isVisible={item[key]}
                    onChange={(v) => handleUpdate(idx, key, v)}
                  />
                );
              }
              if (key === 'icon') {
                return (
                  <div key={key} className="cb-field">
                    <label className="cb-field-label">Icon</label>
                    <select
                      className="cb-select"
                      value={item[key] || ''}
                      onChange={(e) => handleUpdate(idx, key, e.target.value)}
                    >
                      <option value="">Select icon...</option>
                      {ICON_KEYS.map(ik => (
                        <option key={ik} value={ik}>{ik}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (typeof schema[key] === 'boolean') {
                return (
                  <div key={key} className="cb-field">
                    <label className="cb-field-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <select
                      className="cb-input cb-select"
                      value={item[key] === true ? 'true' : 'false'}
                      onChange={(e) => handleUpdate(idx, key, e.target.value === 'true')}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                );
              }
              const isImage = key === 'imageUrl' || key === 'imgUrl' || key === 'thumbnailUrl';
              if (isImage) {
                return <ImageField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={item[key]} onChange={(v) => handleUpdate(idx, key, v)} />;
              }
              const isMultiline = key === 'desc' || key === 'description' || key === 'answer';
              return (
                <StringField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={item[key]}
                  onChange={(v) => handleUpdate(idx, key, v)}
                  multiline={isMultiline}
                />
              );
            })}
          </div>
        </div>
      ))}
      <button className="cb-btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} /> Add Item
      </button>
    </div>
  );
};

// --- Main Editor Component for a Section ---

const SectionEditor = ({ section, onUpdate, allSections = [] }) => {
  const props = section.props || {};
  const config = section.config || {};

  const updateProp = (key, val) => {
    onUpdate('props', { ...props, [key]: val });
  };

  const updateConfig = (key, val) => {
    // For header/footer
    onUpdate(key, val);
  };

  const updateSetting = (key, val) => {
    onUpdate('settings', { ...(section.settings || {}), [key]: val });
  };

  const commonSettings = (
    <>
      <div className="cb-config-section-title" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>Section Settings</div>
      <ColorField
        label="Background Override"
        value={section.settings?.backgroundColorOverride || ''}
        onChange={(v) => updateSetting('backgroundColorOverride', v)}
      />
    </>
  );

  switch (section.type) {
    case 'header':
      return (
        <div className="cb-section-children">
          <StringField label="Company Name" value={config.companyName} onChange={(v) => updateConfig('companyName', v)} />
          <ImageField label="Logo Image" value={config.logoUrl} onChange={(v) => updateConfig('logoUrl', v)} />
          <StringField label="Logo Height (px)" value={config.logoHeight} onChange={(v) => updateConfig('logoHeight', Number(v))} />
          <div className="cb-field">
            <label className="cb-field-label">Sticky Header</label>
            <select
              className="cb-input cb-select"
              value={config.sticky === true ? 'true' : 'false'}
              onChange={(e) => updateConfig('sticky', e.target.value === 'true')}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Navigation Links</div>
          <ArrayEditor
            items={config.navLinks || []}
            onChange={(v) => updateConfig('navLinks', v)}
            schema={{ label: '', targetSectionId: '', isExternal: false }}
            renderItemSummary={(item) => item.label || 'New Link'}
            optionsMap={{
              targetSectionId: allSections.map(s => ({
                value: s.id,
                label: SECTION_META[s.type]?.label || s.id
              }))
            }}
          />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>CTA Button</div>
          {config.ctaButton && (
            <>
              <VisibilityToggle label="Show Button" isVisible={config.ctaButton.isVisible} onChange={(v) => updateConfig('ctaButton', { ...config.ctaButton, isVisible: v })} />
              <StringField label="Button Text" value={config.ctaButton.text} onChange={(v) => updateConfig('ctaButton', { ...config.ctaButton, text: v })} />
              <StringField label="Button Link" value={config.ctaButton.link} onChange={(v) => updateConfig('ctaButton', { ...config.ctaButton, link: v })} />
            </>
          )}
          <div className="cb-config-section-title" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>Section Settings</div>
          <ColorField
            label="Background Override"
            value={config.backgroundColorOverride || ''}
            onChange={(v) => updateConfig('backgroundColorOverride', v)}
          />
        </div>
      );
    case 'footer':
      return (
        <div className="cb-section-children">
          <StringField label="Company Name" value={config.companyName} onChange={(v) => updateConfig('companyName', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Addresses</div>
          <ArrayEditor
            items={(config.contact?.addresses || []).map(a => ({ address: a }))}
            onChange={(arr) => updateConfig('contact', { ...config.contact, addresses: arr.map(a => a.address) })}
            schema={{ address: '' }}
            renderItemSummary={(item, i) => item.address || `Address ${i + 1}`}
          />
          <StringField label="Email" value={config.contact?.email} onChange={(v) => updateConfig('contact', { ...config.contact, email: v })} />
          <StringField label="Phone" value={config.contact?.phone} onChange={(v) => updateConfig('contact', { ...config.contact, phone: v })} />
          <StringField label="Copyright Text" value={config.copyrightText} onChange={(v) => updateConfig('copyrightText', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Social Links</div>
          <ArrayEditor
            items={config.socialLinks || []}
            onChange={(v) => updateConfig('socialLinks', v)}
            schema={{ icon: 'facebook', url: '' }}
            renderItemSummary={(item) => {
              const found = SOCIAL_ICON_OPTIONS.find(o => o.value === item.icon);
              return found ? found.label : (item.icon || 'New Link');
            }}
            optionsMap={{
              icon: SOCIAL_ICON_OPTIONS
            }}
          />
          <div className="cb-config-section-title" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>Section Settings</div>
          <ColorField
            label="Background Override"
            value={config.backgroundColorOverride || ''}
            onChange={(v) => updateConfig('backgroundColorOverride', v)}
          />
          <ColorField
            label="Text Color Override"
            value={config.textColorOverride || ''}
            onChange={(v) => updateConfig('textColorOverride', v)}
          />
        </div>
      );
    case 'HERO':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <StringField label="Subline" value={props.subline} onChange={(v) => updateProp('subline', v)} multiline />
          <ImageField label="Background Image" value={props.backgroundUrl} onChange={(v) => updateProp('backgroundUrl', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>CTA Button</div>
          <StringField label="Button Text" value={props.ctaText} onChange={(v) => updateProp('ctaText', v)} />
          <StringField label="Button Link" value={props.ctaLink} onChange={(v) => updateProp('ctaLink', v)} />
          {commonSettings}
          <ColorField
            label="Text Color Override"
            value={section.settings?.textColorOverride || ''}
            onChange={(v) => updateSetting('textColorOverride', v)}
          />
          <div className="cb-field">
            <label className="cb-field-label">Height (px)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="range"
                min={200}
                max={800}
                step={10}
                value={section.settings?.height || 500}
                onChange={(e) => updateSetting('height', Number(e.target.value))}
                style={{ flex: 1, accentColor: '#FF6B35' }}
              />
              <input
                type="number"
                className="cb-input"
                value={section.settings?.height || 500}
                onChange={(e) => updateSetting('height', Number(e.target.value))}
                min={200}
                max={800}
                style={{ width: 72, textAlign: 'center' }}
              />
            </div>
          </div>
        </div>
      );
    case 'ABOUT':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <StringField label="Description (HTML)" value={props.description} onChange={(v) => updateProp('description', v)} multiline />
          <ImageField label="Image" value={props.imageUrl} onChange={(v) => updateProp('imageUrl', v)} />
          {commonSettings}
        </div>
      );
    case 'EVP':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>EVP Items</div>
          <ArrayEditor
            items={props.items || []}
            onChange={(v) => updateProp('items', v)}
            schema={{ title: '', desc: '', icon: 'star' }}
            renderItemSummary={(item) => item.title || 'New Item'}
          />
          {commonSettings}
        </div>
      );
    case 'AWARDS':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Awards</div>
          <ArrayEditor
            items={props.items || []}
            onChange={(v) => updateProp('items', v)}
            schema={{ name: '', year: '', imgUrl: '' }}
            renderItemSummary={(item) => item.name || 'New Award'}
          />
          {commonSettings}
        </div>
      );
    case 'PROCESS':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Steps</div>
          <ArrayEditor
            items={props.steps || []}
            onChange={(v) => updateProp('steps', v)}
            schema={{ title: '', desc: '' }}
            renderItemSummary={(item, i) => `${i + 1}. ${item.title || 'Step'}`}
          />
          {commonSettings}
        </div>
      );
    case 'FAQ':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Questions</div>
          <ArrayEditor
            items={props.items || []}
            onChange={(v) => updateProp('items', v)}
            schema={{ question: '', answer: '' }}
            renderItemSummary={(item) => item.question || 'New Question'}
          />
          {commonSettings}
        </div>
      );
    case 'LIFE_AT_CO':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>News & Events</div>
          <ArrayEditor
            items={props.news || []}
            onChange={(v) => updateProp('news', v)}
            schema={{ title: '', date: '', thumbnailUrl: '', url: '' }}
            renderItemSummary={(item) => item.title || 'New Article'}
          />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Nav Link</div>
          <VisibilityToggle
            label="Show Button"
            isVisible={props.navLink?.isVisible !== false}
            onChange={(v) => updateProp('navLink', { ...(props.navLink || {}), isVisible: v })}
          />
          <StringField
            label="Button Text"
            value={props.navLink?.text || ''}
            onChange={(v) => updateProp('navLink', { ...(props.navLink || {}), text: v })}
          />
          <StringField
            label="Button Link"
            value={props.navLink?.url || ''}
            onChange={(v) => updateProp('navLink', { ...(props.navLink || {}), url: v })}
          />
          {commonSettings}
        </div>
      );
    case 'GALLERY':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <div className="cb-config-section-title" style={{ marginTop: 16 }}>Images</div>
          <ArrayEditor
            items={(props.images || []).map(url => ({ imageUrl: url }))}
            onChange={(arr) => updateProp('images', arr.map(a => a.imageUrl))}
            schema={{ imageUrl: '' }}
            renderItemSummary={(item, i) => item.imageUrl ? `Image ${i + 1}` : 'New Image'}
          />
          {commonSettings}
        </div>
      );
    case 'CTA_FOOTER':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <StringField label="CTA Text" value={props.ctaText} onChange={(v) => updateProp('ctaText', v)} />
          <StringField label="CTA Link" value={props.ctaLink} onChange={(v) => updateProp('ctaLink', v)} />
          {commonSettings}
        </div>
      );
    case 'JOBS':
      return (
        <div className="cb-section-children">
          <StringField label="Headline" value={props.headline} onChange={(v) => updateProp('headline', v)} />
          <VisibilityToggle label="Show Filters" isVisible={props.showFilter} onChange={(v) => updateProp('showFilter', v)} />
          {commonSettings}
        </div>
      );
    default:
      return <div className="cb-section-children" style={{ color: '#9ca3af', fontSize: 13 }}>No configuration available.</div>;
  }
};

// --- Left Panel ---

const SectionsPanel = ({ sections, onSectionsChange, onUpdateSection, activeSection, onSelectSection }) => {
  const [expanded, setExpanded] = useState(new Set());

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleVisibility = (id) => {
    // If it's header/footer, update_visible property via onUpdateSection instead of mapping layoutConfig
    if (id === 'header' || id === 'footer') {
      const s = sections.find(x => x.id === id);
      onUpdateSection(id, '_visible', !(s.isVisible !== false));
    } else {
      // Normal sections map
      onSectionsChange(sections.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      ));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.currentTarget.classList.add('cb-dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('cb-dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('cb-drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('cb-drag-over');
  };

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('cb-drag-over');
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    // We only swap layout sections, not header/footer
    const layoutSections = sections.filter(s => s.id !== 'header' && s.id !== 'footer');

    // Convert visible indices pointing to the full list, but dragging only works properly 
    // if we abstract just the layout entries.
    // Simplifying: we'll just reorder the whole array then filter in index.js handles it.
    const updated = [...sections];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    onSectionsChange(updated);
  }, [sections, onSectionsChange]);

  return (
    <div className="cb-panel cb-panel-right" style={{ width: 340 }}>
      <div className="cb-panel-header">
        <div>
          <h3 className="cb-panel-title">Sections</h3>
          <p className="cb-panel-subtitle">Manage page layout & content</p>
        </div>
      </div>

      <div className="cb-panel-body">
        <div className="cb-section-list">
          {sections.map((section, index) => {
            const meta = SECTION_META[section.type] || SECTION_META[section.id] || {};
            const isActive = activeSection === section.id;
            const isExpanded = expanded.has(section.id);
            const isFixed = section.id === 'header' || section.id === 'footer';

            return (
              <div
                key={section.id}
                className={`cb-section-wrapper ${isActive ? 'active' : ''}`}
                style={{ marginBottom: 4 }}
              >
                <div
                  className={`cb-section-item ${isActive ? 'active' : ''}`}
                  draggable={!isFixed}
                  onDragStart={!isFixed ? (e) => handleDragStart(e, index) : null}
                  onDragEnd={!isFixed ? handleDragEnd : null}
                  onDragOver={!isFixed ? handleDragOver : null}
                  onDragLeave={!isFixed ? handleDragLeave : null}
                  onDrop={!isFixed ? (e) => handleDrop(e, index) : null}
                  onClick={() => onSelectSection(section.id)}
                >
                  <div className="cb-section-item-left">
                    {!isFixed ? (
                      <span className="cb-drag-handle" title="Drag to reorder">
                        <FontAwesomeIcon icon={faGripVertical} style={{ fontSize: 12 }} />
                      </span>
                    ) : (
                      <span style={{ width: 14, display: 'inline-block' }} />
                    )}

                    <button
                      className="cb-expand-btn"
                      onClick={(e) => toggleExpand(section.id, e)}
                    >
                      <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
                    </button>

                    <span className="cb-section-name">{meta.label || section.type}</span>
                    {meta.system && <span className="cb-system-badge">System</span>}
                  </div>

                  <label className="cb-switch" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={section.isVisible !== false}
                      onChange={() => toggleVisibility(section.id)}
                    />
                    <span className="cb-switch-slider"></span>
                  </label>
                </div>

                {isExpanded && (
                  <SectionEditor
                    section={section}
                    onUpdate={(key, val) => onUpdateSection(section.id, key, val)}
                    allSections={sections}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionsPanel;
