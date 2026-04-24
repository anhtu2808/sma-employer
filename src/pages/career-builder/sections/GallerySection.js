import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const GallerySection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius } = theme;
  const { headline = 'Office Gallery', images = [] } = sectionProps;

  const placeholders = images.length > 0 ? images : [1, 2, 3, 4, 5, 6];

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  const [activeIndex, setActiveIndex] = useState(0);

  const len = placeholders.length;

  const next = () => setActiveIndex((prev) => (prev + 1) % len);
  const prev = () => setActiveIndex((prev) => (prev - 1 + len) % len);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 2000);
    return () => clearInterval(interval);
  }, [len]);

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 0 ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <h2 style={{ fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div className="gallery-wrapper" style={{ position: 'relative', margin: '0 auto', maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        <button 
          onClick={prev}
          title="Previous Image"
          style={{
            position: 'absolute', left: '5%', zIndex: 10,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: primaryColor || '#1890ff', fontSize: '2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.8, transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div 
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Dummy element for container height dependency */}
          <div style={{ width: '55%', maxWidth: '800px', aspectRatio: '16/9', opacity: 0, pointerEvents: 'none' }} />

          {placeholders.map((item, i) => {
            const isUrl = typeof item === 'string' && item.startsWith('http');
            const placeholderBg = secondaryColor || `linear-gradient(${135 + i * 20}deg, ${primaryColor}15, ${primaryColor}08)`;

            let relativeIndex = i - activeIndex;
            if (relativeIndex > Math.floor(len / 2)) relativeIndex -= len;
            if (relativeIndex < -Math.floor(len / 2)) relativeIndex += len;

            const getStyles = (rel) => {
              if (rel === 0) return { left: '50%', transform: 'translate(-50%, -50%) scale(1)', zIndex: 3, opacity: 1, cursor: 'default' };
              if (rel === -1) return { left: '20%', transform: 'translate(-50%, -50%) scale(0.8)', zIndex: 2, opacity: 0.6, cursor: 'pointer' };
              if (rel === 1) return { left: '80%', transform: 'translate(-50%, -50%) scale(0.8)', zIndex: 2, opacity: 0.6, cursor: 'pointer' };
              if (rel < -1) return { left: '-10%', transform: 'translate(-50%, -50%) scale(0.5)', zIndex: 1, opacity: 0, pointerEvents: 'none' };
              if (rel > 1) return { left: '110%', transform: 'translate(-50%, -50%) scale(0.5)', zIndex: 1, opacity: 0, pointerEvents: 'none' };
              return { left: '50%', transform: 'translate(-50%, -50%) scale(0)', opacity: 0, pointerEvents: 'none' };
            };

            const slideStyle = getStyles(relativeIndex);

            return (
              <div
                key={i}
                onClick={() => {
                  if (relativeIndex === -1) prev();
                  if (relativeIndex === 1) next();
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '55%',
                  maxWidth: '800px',
                  aspectRatio: '16/9',
                  borderRadius: `${borderRadius}px`,
                  overflow: 'hidden',
                  ...slideStyle,
                  transition: 'all 0.5s ease-in-out',
                  background: isUrl
                    ? `url(${item}) center/cover no-repeat`
                    : placeholderBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`,
                  color: `${primaryColor}40`,
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: relativeIndex === 0 ? '0 8px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                {!isUrl && '🖼'}
              </div>
            );
          })}
        </div>

        <button 
          onClick={next}
          title="Next Image"
          style={{
            position: 'absolute', right: '5%', zIndex: 10,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: primaryColor || '#1890ff', fontSize: '2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.8, transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

      </div>
    </div>
  );
};

export default GallerySection;
