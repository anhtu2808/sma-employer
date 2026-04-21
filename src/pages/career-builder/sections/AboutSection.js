import React from 'react';

const AboutSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const {
    headline = 'Who We Are',
    description = 'We\'re a global technology company dedicated to solving complex problems with elegant solutions.',
    imageUrl,
  } = sectionProps;

  const shadowMap = {
    none: 'none',
    subtle: '0 10px 30px rgba(0,0,0,0.08)',
    medium: '0 20px 40px rgba(0,0,0,0.12)',
  };

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 80}px 40px ${settings.paddingBottom || 80}px`,
      textAlign: settings.textAlign || 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background soft glow */}
      <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '50%', height: '100%', background: `radial-gradient(circle, ${primaryColor}08 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '40%', height: '60%', background: `radial-gradient(circle, ${secondaryColor || primaryColor}06 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        display: 'flex', gap: '64px', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto', maxWidth: '1280px', flexWrap: 'wrap',
        position: 'relative', zIndex: 1
      }}>
        
        {imageUrl && (
          <div style={{ position: 'relative', flex: '1 1 400px', maxWidth: '550px' }}>
            
            {/* Dots background layer */}
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', zIndex: 0 }}>
              <svg width="120" height="120" opacity="0.4">
                <pattern id="about-dots-emp" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle fill={primaryColor} cx="3" cy="3" r="3"></circle>
                </pattern>
                <rect x="0" y="0" width="120" height="120" fill="url(#about-dots-emp)"></rect>
              </svg>
            </div>

            {/* Glowing geometric offset frame */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: 'translate(20px, 20px)', border: `2px solid ${primaryColor}40`, borderRadius: `${borderRadius}px`, zIndex: 0 }} />

            {/* Main Image Wrapper */}
            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              boxShadow: shadowMap[shadow] || shadowMap.subtle,
              aspectRatio: '4/3',
            }}>
              <div 
                style={{
                  width: '100%', height: '100%',
                  background: `url(${imageUrl}) center/cover no-repeat`,
                  transition: 'transform 0.5s ease',
                  cursor: 'pointer'
                }} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>

          </div>
        )}

        <div style={{ flex: '1 1 500px', textAlign: imageUrl ? 'left' : 'center', maxWidth: imageUrl ? 'none' : '800px' }}>
          
          {/* Section Indicator Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: imageUrl ? 'flex-start' : 'center', gap: '12px', marginBottom: '20px', color: primaryColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px` }}>
            <span style={{ width: '40px', height: '2px', background: primaryColor }} />
            Discover
          </div>
          
          <h2 style={{ fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || textColor, marginBottom: '24px', lineHeight: 1.25 }}>
            {headline}
          </h2>
          
          <div
            style={{
              fontSize: `${18 * ((theme.baseFontSize || 16) / 16)}px`, color: settings.textColorOverride || textColor, opacity: 0.75,
              lineHeight: 1.85,
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

      </div>
    </div>
  );
};

export default AboutSection;
