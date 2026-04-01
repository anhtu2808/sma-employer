import React from 'react';

const AboutSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const {
    headline = 'Chúng tôi là ai?',
    description = 'We\'re a global technology company dedicated to solving complex problems with elegant solutions.',
    imageUrl,
  } = sectionProps;

  const shadowMap = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: settings.textAlign || 'center',
    }}>
      <div style={{
        display: 'flex', gap: '40px', alignItems: 'center',
        maxWidth: '700px', margin: '0 auto',
        flexDirection: imageUrl ? 'row' : 'column',
      }}>
        {imageUrl && (
          <div style={{
            width: '280px', flexShrink: 0,
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
            boxShadow: shadowMap[shadow],
          }}>
            <div style={{
              height: '200px',
              background: `url(${imageUrl}) center/cover no-repeat`,
            }} />
          </div>
        )}

        <div style={{ textAlign: imageUrl ? 'left' : 'center', flex: 1 }}>
          <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '16px' }}>
            {headline}
          </h2>
          <div
            style={{
              fontSize: `${15 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.65,
              lineHeight: 1.8, maxWidth: imageUrl ? 'none' : '600px',
              margin: imageUrl ? 0 : '0 auto',
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
