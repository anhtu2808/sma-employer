import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveIcon } from '@/utils/icons';

const FAQSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, backgroundColor, textColor, baseFontSize = 16 } = theme;
  const { headline = 'Frequently Asked Questions', items = [] } = sectionProps;
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const defaultItems = items.length > 0 ? items : [
    { question: 'Do you offer internship programs?', answer: 'Yes, we always welcome talented students and provide opportunities to work on real-world projects with expert mentorship.' },
    { question: 'What are the working hours?', answer: 'Our working hours are flexible from Monday to Friday (8:30 AM - 5:30 PM). We prioritize results over strict time tracking.' },
    { question: 'Do you support remote work?', answer: 'Yes, we have a modern Hybrid Work policy, allowing employees to work from home 2 days per week for better work-life balance.' },
    { question: 'What is the interview process?', answer: 'Typically, it involves 3 rounds: CV Screening, Technical/Professional Interview, and Cultural Interview with the Leadership team.' },
  ];

  const sectionBg = settings.backgroundColorOverride || backgroundColor;
  const scale = baseFontSize / 16;

  return (
    <div style={{
      background: sectionBg,
      padding: `${(settings.paddingTop || 100) * scale}px 20px ${(settings.paddingBottom || 100) * scale}px`,
      position: 'relative',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: `${40 * scale}px`, 
            fontWeight: 800, 
            color: settings.textColorOverride || textColor, 
            margin: '0 0 16px',
            letterSpacing: '-1px'
          }}>
            {headline}
          </h2>
          <div style={{ 
            width: '60px', 
            height: '4px', 
            background: primaryColor, 
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {defaultItems.filter(item => item.isVisible !== false).map((item, i) => {
            const isOpen = openIndex === i;
            const isHovered = hoveredIndex === i;
            
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  borderRadius: '20px',
                  background: '#FFFFFF',
                  boxShadow: isOpen ? '0 20px 40px rgba(0,0,0,0.08)' : (isHovered ? '0 10px 30px rgba(0,0,0,0.06)' : '0 4px 12px rgba(0,0,0,0.03)'),
                  border: `1px solid ${isOpen ? primaryColor + '20' : 'rgba(0,0,0,0.05)'}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%', 
                    padding: '24px 32px',
                    background: 'transparent',
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '36px', height: '36px', 
                      borderRadius: '10px', 
                      background: isOpen ? primaryColor : (isHovered ? primaryColor + '15' : 'rgba(0,0,0,0.04)'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isOpen ? '#FFFFFF' : (isHovered ? primaryColor : 'rgba(0,0,0,0.4)'),
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}>
                      <FontAwesomeIcon icon={resolveIcon('quiz')} style={{ fontSize: '1.2rem' }} />
                    </div>
                    <span style={{ 
                      fontSize: `${18 * scale}px`, 
                      fontWeight: 700, 
                      color: isOpen ? primaryColor : (settings.textColorOverride || textColor),
                      transition: 'color 0.3s ease'
                    }}>
                      {item.question}
                    </span>
                  </div>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: isOpen ? primaryColor + '10' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isOpen ? primaryColor : 'rgba(0,0,0,0.3)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={resolveIcon('expand_more')} />
                  </div>
                </button>
                
                <div style={{
                  maxHeight: isOpen ? '500px' : '0',
                  opacity: isOpen ? 1 : 0,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '0 32px 32px 88px',
                    fontSize: `${16 * scale}px`, 
                    color: settings.textColorOverride || textColor, 
                    opacity: 0.8, 
                    lineHeight: 1.8,
                  }}>
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
