import React from 'react';

const HeroSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, borderRadius, buttonStyle, backgroundColor } = theme;
  const {
    headline = 'Build the Future With Us',
    subline = 'Join a team of passionate innovators shaping the next generation of technology.',
    ctaText = 'Explore Now',
    ctaLink = '#',
    backgroundUrl,
  } = sectionProps;

  const pad = `${settings.paddingTop || 120}px 40px ${settings.paddingBottom || 120}px`;

  const btnBase = {
    padding: '14px 32px',
    borderRadius: `${borderRadius}px`,
    fontSize: `${16 * ((theme.baseFontSize || 16) / 16)}px`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  const bgStyle = backgroundUrl
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}DD 50%, ${primaryColor}99 100%)` };

  // If we have an override and no image, use the override instead of the gradient
  const finalBgStyle = (settings.backgroundColorOverride && !backgroundUrl)
    ? { background: settings.backgroundColorOverride }
    : bgStyle;

  return (
    <div style={{
      ...finalBgStyle,
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
          fontSize: `${50 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: (settings.backgroundColorOverride === '#FFFFFF' || backgroundColor === '#FFFFFF') && !backgroundUrl ? theme.textColor : '#fff',
          lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.5px',
        }}>
          {headline}
        </h1>

        <p style={{
          fontSize: `${18 * ((theme.baseFontSize || 16) / 16)}px`, color: (settings.backgroundColorOverride === '#FFFFFF' || backgroundColor === '#FFFFFF') && !backgroundUrl ? theme.textColor : 'rgba(255,255,255,0.85)',
          maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7,
          opacity: 0.8,
        }}>
          {subline}
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <button style={{
            ...btnBase,
            background: buttonStyle === 'ghost' ? 'transparent' : '#fff',
            color: primaryColor,
            border: buttonStyle === 'outline' ? `2px solid ${secondaryColor || '#fff'}` : 'none',
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
