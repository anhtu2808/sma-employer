import React, { useState } from 'react';

const FAQSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius } = theme;
  const { headline = 'Frequently Asked Questions', items = [] } = sectionProps;
  const [openIndex, setOpenIndex] = useState(null);

  const defaultItems = items.length > 0 ? items : [
    { question: 'Do you offer internship programs?', answer: 'Yes, we always welcome talented students to join our team.' },
    { question: 'What are the working hours?', answer: 'Monday to Friday, 8:30 AM - 5:30 PM.' },
    { question: 'Do you support remote work?', answer: 'Yes, employees can work from home 2 days per week under our Hybrid Work policy.' },
  ];

  const sectionBg = settings.backgroundColorOverride || backgroundColor;

  return (
    <div style={{
      background: sectionBg,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: `${32 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'left' }}>
        {defaultItems.filter(item => item.isVisible !== false).map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                borderRadius: `${borderRadius}px`,
                border: '1px solid rgba(0,0,0,0.08)',
                marginBottom: '10px',
                overflow: 'hidden',
                transition: 'all 0.2s',
                background: '#FFFFFF', // Fix item background to white
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: isOpen ? secondaryColor || `${primaryColor}08` : 'transparent', // Use secondaryColor for active bg
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 600, color: textColor }}>
                  {item.question}
                </span>
                <span style={{
                  fontSize: `${18 * ((theme.baseFontSize || 16) / 16)}px`, color: primaryColor, fontWeight: 700,
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}>
                  +
                </span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '16px 20px',
                  fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`,
                  color: textColor,
                  opacity: 0.65,
                  lineHeight: 1.7,
                }}>
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
