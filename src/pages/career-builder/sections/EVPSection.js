import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { materialToFA, resolveIcon } from '@/utils/icons';

const ICON_KEYS = Object.keys(materialToFA).sort();

const EVPSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Why Join Us?' } = sectionProps;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Compute items directly to avoid infinite loops with useEffect
  const displayItems = (sectionProps.items && sectionProps.items.length > 0)
    ? sectionProps.items
    : [
      { title: 'Competitive Compensation', desc: '13th-month salary plus periodic project performance bonuses.', icon: 'payments' },
      { title: 'Hybrid Work Environment', desc: 'Flexible work-from-home 2 days per week.', icon: 'apartment' },
      { title: 'Career Growth Path', desc: 'Salary reviews twice a year with a clear progression roadmap.', icon: 'trending_up' },
      { title: 'Comprehensive Health', desc: 'Premium health insurance for you and your family.', icon: 'security' },
    ];


  const shadowMap = {
    none: 'none',
    subtle: '0 4px 16px rgba(0,0,0,0.06)',
    medium: '0 10px 30px rgba(0,0,0,0.08)',
  };

  // Use background color override if set, otherwise fallback to global background
  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div
      className="mfv-evp-section"
      style={{
        background: sectionBg,
        padding: `${settings.paddingTop || 140}px 40px ${settings.paddingBottom || 140}px`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        clipPath: 'inset(0)' // Essential for the 'stationary' background effect
      }}
    >
      {/* STATIONARY BACKGROUND PATTERN (Parallax) */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: settings.patternColorOverride ? 0.15 : 0.08,
        color: settings.patternColorOverride || primaryColor,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center'
      }}>
        <div style={{ fontSize: '250px', transform: 'rotate(-15deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('payments')} /></div>
        <div style={{ fontSize: '180px', transform: 'rotate(20deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('security')} /></div>
        <div style={{ fontSize: '300px', transform: 'rotate(-5deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('trending_up')} /></div>
        <div style={{ fontSize: '200px', transform: 'rotate(10deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('redeem')} /></div>
        <div style={{ fontSize: '150px', transform: 'rotate(-25deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('groups')} /></div>
        <div style={{ fontSize: '280px', transform: 'rotate(15deg)', margin: '50px' }}><FontAwesomeIcon icon={resolveIcon('apartment')} /></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: `${40 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 800, color: settings.textColorOverride || textColor, margin: 0, lineHeight: 1.25, letterSpacing: '-1px' }}>
            {headline}
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px',
          maxWidth: '1440px', margin: '0 auto',
        }}>
          {displayItems.filter(b => b.isVisible !== false).map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: '#FFFFFF',
                borderRadius: `${borderRadius}px`,
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: hoveredIndex === i ? '0 30px 60px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.5s ease',
                transform: hoveredIndex === i ? 'translateY(-15px)' : 'translateY(0)',
                cursor: 'default',
              }}
            >
              <div style={{
                fontSize: '40px',
                color: primaryColor,
                width: '80px', height: '80px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${primaryColor}10`,
                borderRadius: `${Math.max(0, borderRadius - 4)}px`,
                margin: '0 auto 20px',
                transition: 'all 0.4s ease',
                transform: hoveredIndex === i ? 'scale(1.1) rotate(10deg)' : 'scale(1)'
              }}>
                <FontAwesomeIcon icon={resolveIcon(b.icon)} />
              </div>

              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.3 }}>
                {b.title}
              </div>
              <div style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EVPSection;
