import React from 'react';

const GallerySection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius } = theme;
  const { headline = 'Office Gallery', images = [] } = sectionProps;

  const placeholders = images.length > 0 ? images : [1, 2, 3, 4, 5, 6];

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        {placeholders.map((item, i) => {
          const isUrl = typeof item === 'string' && item.startsWith('http');
          const placeholderBg = secondaryColor || `linear-gradient(${135 + i * 20}deg, ${primaryColor}15, ${primaryColor}08)`;
          
          return (
            <div
              key={i}
              style={{
                borderRadius: `${borderRadius}px`,
                overflow: 'hidden',
                aspectRatio: i === 0 ? '2/1' : '1/1',
                gridColumn: i === 0 ? 'span 2' : 'span 1',
                background: isUrl
                  ? `url(${item}) center/cover no-repeat`
                  : placeholderBg, // Use secondaryColor for placeholders
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`,
                color: `${primaryColor}40`,
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              {!isUrl && '🖼'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GallerySection;
