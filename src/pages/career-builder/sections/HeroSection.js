import React from 'react';

const HeroSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, borderRadius, buttonStyle } = theme;
  const {
    headline = 'Build the Future With Us',
    subline = 'Join a team of passionate innovators shaping the next generation of technology.',
    ctaText = 'Khám phá ngay',
    ctaLink = '#',
    backgroundUrl,
  } = sectionProps;

  const pad = `${settings.paddingTop || 80}px 40px ${settings.paddingBottom || 80}px`;

  const btnBase = {
    padding: '14px 32px',
    borderRadius: `${borderRadius}px`,
    fontSize: `${16 * ((theme.baseFontSize || 16) / 16)}px`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const bgStyle = backgroundUrl
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}DD 50%, ${primaryColor}99 100%)` };

  return (
    <div style={{
      ...bgStyle,
      padding: pad,
      textAlign: settings.textAlign || 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: `${42 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: '#fff',
          lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px',
        }}>
          {headline}
        </h1>

        <p style={{
          fontSize: `${16 * ((theme.baseFontSize || 16) / 16)}px`, color: 'rgba(255,255,255,0.85)',
          maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6,
        }}>
          {subline}
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <button style={{
            ...btnBase,
            background: buttonStyle === 'ghost' ? 'transparent' : '#fff',
            color: primaryColor,
            border: buttonStyle === 'outline' ? '2px solid #fff' : 'none',
            boxShadow: buttonStyle === 'shadow' ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
          }}>
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
