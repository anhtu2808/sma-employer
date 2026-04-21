import React from 'react';

const CTAFooterSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, borderRadius, backgroundColor } = theme;
  const {
    headline = 'Ready to Accelerate Your Career?',
    ctaText = 'Apply Now',
    ctaLink = '#',
  } = sectionProps;

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: settings.backgroundColorOverride ? settings.backgroundColorOverride : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
      }} />
      <div style={{
        position: 'absolute', bottom: -20, left: '20%', width: 80, height: 80,
        borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || (settings.backgroundColorOverride === '#FFFFFF' ? theme.textColor : '#fff'), marginBottom: '12px' }}>
          {headline}
        </h2>
        {ctaText && (
          <button style={{
            padding: '14px 36px',
            borderRadius: `${borderRadius}px`,
            background: secondaryColor || '#fff', // Use secondaryColor for CTA button background
            color: primaryColor,
            border: 'none',
            fontSize: `${16 * ((theme.baseFontSize || 16) / 16)}px`,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: theme.buttonStyle === 'shadow' ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
          }}>
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CTAFooterSection;
