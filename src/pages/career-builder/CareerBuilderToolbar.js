import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@/utils/icons';
import { Tooltip } from 'antd';

const CareerBuilderToolbar = ({
  slug,
  onSlugChange,
  status,
  onSaveDraft,
  onPublish,
  isSaving,
  isArchiving,
  isPreviewMode,
  onPreviewToggle,
  onArchive,
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
            <Tooltip title={`Your domain will be displayed at https://${slug || 'your-slug'}.smartrecruit.tech/`} placement="bottom">
              <input
                type="text"
                value={slug || ''}
                onChange={(e) => onSlugChange && onSlugChange(e.target.value.toLowerCase())}
                placeholder="page-slug"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '4px 10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  width: '200px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.15)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fff';
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.15)';
                }}
                spellCheck={false}
              />
            </Tooltip>
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
        <button
          className="cb-btn-secondary"
          onClick={onArchive}
          disabled={isSaving || isArchiving || status === 'archived'}
          style={{
            color: status === 'archived' ? undefined : '#dc3545',
            borderColor: status === 'archived' ? undefined : '#dc3545',
            opacity: status === 'archived' ? 0.5 : 1
          }}
        >
          {isArchiving ? 'Archiving...' : 'Archive'}
        </button>

        <button
          className="cb-btn-secondary"
          onClick={onSaveDraft}
          disabled={isSaving || isArchiving || status === 'archived'}
        >
          {isSaving && status === 'draft' ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          className="cb-btn-primary"
          onClick={onPublish}
          disabled={isSaving || isArchiving}
        >
          {status === 'archived'
            ? (isSaving ? 'Unarchiving...' : 'Unarchive')
            : (isSaving && status === 'published' ? 'Publishing...' : 'Publish')}
        </button>
      </div>
    </div>
  );
};

export default CareerBuilderToolbar;
