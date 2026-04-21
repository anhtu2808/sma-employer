import React from 'react';

const ProcessSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, spacing } = theme;
  const { headline = 'Hiring Process', steps = [] } = sectionProps;

  const defaultSteps = steps.length > 0 ? steps : [
    { title: 'Apply', desc: 'Submit your CV via the apply button on the page.' },
    { title: 'Interview', desc: 'Chat with our HR team and technical leads.' },
    { title: 'Get Offer', desc: 'Welcome aboard \u2014 join our team!' },
  ];

  const sectionBg = settings.backgroundColorOverride || (backgroundColor === '#FFFFFF' ? `${primaryColor}05` : backgroundColor);

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: settings.textAlign || 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Bold Wave Left Pattern */}
      <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <svg width="250" height="600" viewBox="0 0 250 600" fill="none">
          <path d="M-40,-50 Q250,300 -40,650" stroke={primaryColor} strokeWidth="50" strokeLinecap="round" opacity="0.15" />
          <path d="M-40,80 Q160,300 -40,520" stroke={secondaryColor || primaryColor} strokeWidth="40" strokeLinecap="round" opacity="0.6" />
          <path d="M-40,210 Q90,300 -40,390" stroke={primaryColor} strokeWidth="30" strokeLinecap="round" opacity="1" />
        </svg>
      </div>

      {/* Bold Wave Right Pattern */}
      <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <svg width="250" height="600" viewBox="0 0 250 600" fill="none">
          <path d="M290,-50 Q0,300 290,650" stroke={primaryColor} strokeWidth="50" strokeLinecap="round" opacity="0.15" />
          <path d="M290,80 Q90,300 290,520" stroke={secondaryColor || primaryColor} strokeWidth="40" strokeLinecap="round" opacity="0.6" />
          <path d="M290,210 Q160,300 290,390" stroke={primaryColor} strokeWidth="30" strokeLinecap="round" opacity="1" />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || textColor, marginBottom: '48px' }}>
          {headline}
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${Math.min(defaultSteps.length, 4)}, 1fr)`,
          gap: '32px', maxWidth: '1280px', margin: '0 auto', position: 'relative',
        }}>
          {defaultSteps.filter(s => s.isVisible !== false).map((step, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: primaryColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: `${18 * ((theme.baseFontSize || 16) / 16)}px`, margin: '0 auto 20px',
                boxShadow: `0 4px 12px ${primaryColor}40`,
                position: 'relative', zIndex: 2
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              {i < defaultSteps.filter(s => s.isVisible !== false).length - 1 && (
                <div style={{
                  position: 'absolute', top: 30, left: '60%', width: '100%',
                  height: '2px', background: secondaryColor || `${primaryColor}30`,
                }} />
              )}
              <div style={{ fontSize: `${17 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: settings.textColorOverride || textColor, marginBottom: '8px' }}>
                {step.title}
              </div>
              <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: settings.textColorOverride || textColor, opacity: 0.55, lineHeight: 1.6 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
