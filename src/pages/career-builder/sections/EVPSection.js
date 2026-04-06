import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { materialToFA, resolveIcon } from '@/utils/icons';

const ICON_KEYS = Object.keys(materialToFA).sort();

const EVPSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Why Join Us?' } = sectionProps;

  const [items, setItems] = useState([]);

  // Initialize items from props or fallback to defaults using valid materialToFA keys
  useEffect(() => {
    if (sectionProps.items && sectionProps.items.length > 0) {
      setItems(sectionProps.items);
    } else {
      setItems([
        { title: 'Competitive Compensation', desc: '13th-month salary plus periodic project performance bonuses.', icon: 'payments' },
        { title: 'Hybrid Work Environment', desc: 'Flexible work-from-home 2 days per week.', icon: 'apartment' },
        { title: 'Career Growth Path', desc: 'Salary reviews twice a year with a clear progression roadmap.', icon: 'trending_up' },
        { title: 'Comprehensive Health', desc: 'Premium health insurance for you and your family.', icon: 'security' },
      ]);
    }
  }, [sectionProps.items]);

  const handleIconChange = (index, newIcon) => {
    const newItems = [...items];
    newItems[index].icon = newIcon;
    setItems(newItems);
  };

  const shadowMap = {
    none: 'none',
    subtle: '0 2px 8px rgba(0,0,0,0.06)',
    medium: '0 4px 20px rgba(0,0,0,0.1)',
  };

  const sectionBg = settings.backgroundColorOverride || (backgroundColor === '#FFFFFF' ? `${primaryColor}06` : backgroundColor);

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
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        {items.filter(b => b.isVisible !== false).map((b, i) => (
          <div key={i} style={{
            background: '#FFFFFF', // Fix card background to white
            borderRadius: `${borderRadius}px`,
            padding: '36px 32px',
            textAlign: 'left',
            boxShadow: shadowMap[shadow],
            border: '1px solid rgba(0,0,0,0.06)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                fontSize: `${28 * ((theme.baseFontSize || 16) / 16)}px`,
                color: primaryColor,
                width: '52px', height: '52px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: secondaryColor, // Use secondaryColor for icon background
                borderRadius: '8px'
              }}>
                <FontAwesomeIcon icon={resolveIcon(b.icon)} />
              </div>

            </div>

            <div style={{ fontSize: `${18 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {b.title}
            </div>
            <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.6, lineHeight: 1.7 }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EVPSection;
