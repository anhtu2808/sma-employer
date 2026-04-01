import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@/utils/icons';

const CareerBuilderToolbar = ({
  slug,
  onSlugChange,
  status,
  onSaveDraft,
  onPublish,
  isSaving,
  isPreviewMode,
  onPreviewToggle,
}) => {
  const navigate = useNavigate();

  const statusLabel = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
  };

  return (
    <div className="cb-toolbar">
      {/* Left */}
      <div className="cb-toolbar-left">
        <button
          className="cb-toolbar-back"
          onClick={() => navigate('/company')}
          title="Back to Company"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="cb-toolbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="cb-toolbar-logo">CP</span>
          <span className="cb-toolbar-title">Career Page Builder</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
             <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginRight: '4px' }}>/</span>
             <input
               type="text"
               value={slug || ''}
               onChange={(e) => onSlugChange && onSlugChange(e.target.value)}
               placeholder="page-slug"
               style={{
                 background: 'transparent',
                 border: 'none',
                 borderBottom: '1px solid rgba(255,255,255,0.3)',
                 color: '#fff',
                 padding: '2px 4px',
                 fontSize: '13px',
                 width: '180px',
                 outline: 'none',
                 transition: 'border-color 0.2s'
               }}
               onFocus={(e) => e.target.style.borderBottomColor = '#fff'}
               onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.3)'}
               spellCheck={false}
             />
          </div>
        </div>
        <span className={`cb-status-badge ${status}`} style={{ marginLeft: '12px' }}>
          {statusLabel[status] || status}
        </span>
      </div>

      {/* Center spacer */}
      <div className="cb-toolbar-center">
        <div className="cb-preview-toggle">
          <button
            className={`cb-preview-btn ${isPreviewMode ? 'active' : ''}`}
            onClick={onPreviewToggle}
            title={isPreviewMode ? 'Exit Preview' : 'Enter Preview'}
          >
            <FontAwesomeIcon icon={isPreviewMode ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      {/* Right – Actions */}
      <div className="cb-toolbar-right">
        <div className="cb-autosave-indicator">
          <span className="cb-autosave-dot"></span>
          Auto-saved
        </div>

        <button
          className="cb-btn-secondary"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          className="cb-btn-primary"
          onClick={onPublish}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default CareerBuilderToolbar;
