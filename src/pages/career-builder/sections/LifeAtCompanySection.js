import React from 'react';

const LifeAtCompanySection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Life at the Company', news = [], navLink = {} } = sectionProps;

  const shadowMap = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const defaultNews = news.length > 0 ? news : [
    { title: 'Team Building 2025 in Phu Quoc', thumbnailUrl: '', date: '03/15/2026' },
    { title: 'Workshop: The Future of Generative AI', thumbnailUrl: '', date: '03/10/2026' },
    { title: 'Internal Hackathon Q1/2026', thumbnailUrl: '', date: '02/01/2026' },
  ];

  const sectionBg = settings.backgroundColorOverride || (backgroundColor === '#FFFFFF' ? `${primaryColor}05` : backgroundColor);

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        maxWidth: '750px', margin: '0 auto 40px',
      }}>
        <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, margin: 0 }}>
          {headline}
        </h2>
        {navLink.isVisible !== false && navLink.text && (
          <a
            href={navLink.url || '#'}
            target={navLink.url?.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            style={{
              fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`,
              fontWeight: 600,
              color: primaryColor,
              textDecoration: 'none',
              borderBottom: `1.5px solid ${primaryColor}`,
              paddingBottom: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
            }}
          >
            {navLink.text} <span style={{ fontSize: '16px' }}>→</span>
          </a>
        )}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(defaultNews.length, 3)}, 1fr)`,
        gap: '20px', maxWidth: '750px', margin: '0 auto',
      }}>
        {defaultNews.filter(item => item.isVisible !== false).map((item, i) => {
          const cardContent = (
            <div style={{
              background: '#FFFFFF',
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
                background: item.thumbnailUrl ? `url(${item.thumbnailUrl}) center/cover no-repeat` : secondaryColor || `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}08)`,
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
