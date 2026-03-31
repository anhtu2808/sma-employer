import React from 'react';

const ProcessSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, backgroundColor, textColor, borderRadius, spacing } = theme;
  const { headline = 'Quy trình ứng tuyển', steps = [] } = sectionProps;

  const defaultSteps = steps.length > 0 ? steps : [
    { title: 'Nộp đơn', desc: 'Gửi CV qua nút ứng tuyển trên trang.' },
    { title: 'Phỏng vấn', desc: 'Trò chuyện cùng HR và Team kỹ thuật.' },
    { title: 'Nhận Offer', desc: 'Chào mừng bạn về với đội của chúng tôi!' },
  ];

  return (
    <div style={{
      background: settings.backgroundColorOverride || `${primaryColor}05`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: settings.textAlign || 'center',
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '48px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${Math.min(defaultSteps.length, 4)}, 1fr)`,
        gap: '24px', maxWidth: '750px', margin: '0 auto', position: 'relative',
      }}>
        {defaultSteps.filter(s => s.isVisible !== false).map((step, i) => (
          <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: primaryColor, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '16px', margin: '0 auto 16px',
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            {i < defaultSteps.length - 1 && (
              <div style={{
                position: 'absolute', top: 24, left: '60%', width: '80%',
                height: '2px', background: `${primaryColor}30`,
              }} />
            )}
            <div style={{ fontSize: '15px', fontWeight: 700, color: textColor, marginBottom: '6px' }}>
              {step.title}
            </div>
            <div style={{ fontSize: '12px', color: textColor, opacity: 0.55, lineHeight: 1.5 }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSection;
