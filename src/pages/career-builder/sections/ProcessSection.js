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
    }}>
      <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '48px' }}>
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
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            {i < defaultSteps.length - 1 && (
              <div style={{
                position: 'absolute', top: 30, left: '60%', width: '80%',
                height: '2px', background: secondaryColor || `${primaryColor}30`, // Use secondaryColor for lines
              }} />
            )}
            <div style={{ fontSize: `${17 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {step.title}
            </div>
            <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.55, lineHeight: 1.6 }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSection;
