import React from 'react';

const AwardsSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Prestigious Awards', items = [] } = sectionProps;

  const shadowMap = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
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
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: settings.textAlign || 'center',
    }}>
      <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap',
        maxWidth: '700px', margin: '0 auto',
      }}>
        {defaultItems.filter(item => item.isVisible !== false).map((item, i) => (
          <div key={i} style={{
            background: '#FFFFFF', // Fix card background to white
            borderRadius: `${borderRadius}px`,
            padding: '28px 24px',
            boxShadow: shadowMap[shadow],
            border: '1px solid rgba(0,0,0,0.06)',
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: `${borderRadius}px`,
              background: item.imgUrl ? `url(${item.imgUrl}) center/contain no-repeat` : secondaryColor, // Use secondaryColor for icon bg
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: `${28 * ((theme.baseFontSize || 16) / 16)}px`,
            }}>
            </div>
            <div style={{ fontSize: `${15 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, textAlign: 'center' }}>
              {item.name}
            </div>
            <div style={{
              fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 600, color: primaryColor,
              background: secondaryColor, padding: '3px 10px', // Use secondaryColor for year badge
              borderRadius: '20px',
            }}>
              {item.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwardsSection;
