import React, { useState } from 'react';

const AwardsSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Prestigious Awards', items = [] } = sectionProps;

  const shadowMap = {
    none: 'none', subtle: '0 4px 16px rgba(0,0,0,0.06)', medium: '0 10px 30px rgba(0,0,0,0.08)',
  };

  const defaultItems = items.length > 0 ? items : [
    { name: 'Best IT Company 2025', imgUrl: '', year: '2025' },
    { name: 'Top 10 AI Startups', imgUrl: '', year: '2024' },
    { name: 'Great Place to Work', imgUrl: '', year: '2024' },
  ];

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 80}px 40px ${settings.paddingBottom || 80}px`,
      textAlign: settings.textAlign || 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Wave Background */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'auto', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill={primaryColor} d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,160C672,160,768,192,864,202.7C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: `${primaryColor}10`, border: `1px solid ${primaryColor}30`, color: primaryColor, borderRadius: '24px', fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Achievements
            </div>
            <h2 style={{ fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || textColor, margin: 0, lineHeight: 1.25 }}>
              {headline}
            </h2>
        </div>

        <div style={{
          display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {defaultItems.filter(item => item.isVisible !== false).map((item, i) => (
            <div 
              key={i} 
              style={{
                background: '#FFFFFF', // Fix card background to white
                borderRadius: `${borderRadius}px`,
                padding: '40px 32px',
                boxShadow: shadowMap[shadow] || shadowMap.medium,
                border: '1px solid rgba(0,0,0,0.05)',
                width: '320px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
                position: 'relative'
              }}
            >
              {/* Permanent Aura Glow */}
              <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '120px', background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`, filter: 'blur(15px)', zIndex: 0, opacity: 0.8 }} />
              
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: item.imgUrl ? `url(${item.imgUrl}) center/contain no-repeat` : `${primaryColor}08`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: item.imgUrl ? 'none' : `3px solid ${primaryColor}20`,
                zIndex: 1, position: 'relative',
              }}>
                {!item.imgUrl && (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                <div style={{ fontSize: `${20 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: textColor, textAlign: 'center', lineHeight: 1.4 }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: primaryColor,
                  background: `${primaryColor}10`,
                  padding: '6px 20px', borderRadius: '24px',
                  letterSpacing: '0.5px'
                }}>
                  {item.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardsSection;
