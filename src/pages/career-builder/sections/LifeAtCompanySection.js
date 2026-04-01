import React from 'react';

const LifeAtCompanySection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Đời sống tại công ty', news = [] } = sectionProps;

  const shadowMap = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const defaultNews = news.length > 0 ? news : [
    { title: 'Team Building 2025 tại Phú Quốc', thumbnailUrl: '', date: '15/03/2026' },
    { title: 'Workshop: Tương lai của Generative AI', thumbnailUrl: '', date: '10/03/2026' },
    { title: 'Hackathon nội bộ Q1/2026', thumbnailUrl: '', date: '01/02/2026' },
  ];

  const sectionBg = settings.backgroundColorOverride || (backgroundColor === '#FFFFFF' ? `${primaryColor}05` : backgroundColor);

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
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(defaultNews.length, 3)}, 1fr)`,
        gap: '20px', maxWidth: '750px', margin: '0 auto',
      }}>
        {defaultNews.filter(item => item.isVisible !== false).map((item, i) => {
          const cardContent = (
            <div style={{
              background: '#FFFFFF', // Fix card background to white
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              boxShadow: shadowMap[shadow],
              border: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'left',
              height: '100%',
              transition: 'transform 0.2s',
              cursor: item.url ? 'pointer' : 'default',
            }}>
              <div style={{
                height: '140px',
                background: item.thumbnailUrl ? `url(${item.thumbnailUrl}) center/cover no-repeat` : secondaryColor || `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}08)`, // Use secondaryColor for placeholders
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: `${36 * ((theme.baseFontSize || 16) / 16)}px`,
              }}>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '6px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.45 }}>
                  {item.date}
                </div>
              </div>
            </div>
          );

          return item.url ? (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              {cardContent}
            </a>
          ) : (
            <div key={i} style={{ height: '100%' }}>
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifeAtCompanySection;
