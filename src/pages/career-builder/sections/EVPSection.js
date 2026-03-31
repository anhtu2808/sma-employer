import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { materialToFA, resolveIcon } from '@/utils/icons';

const ICON_KEYS = Object.keys(materialToFA).sort();

const EVPSection = ({ theme, sectionProps = {}, settings = {} }) => {
  const { primaryColor, backgroundColor, textColor, borderRadius, shadow } = theme;
  const { headline = 'Tại sao bạn nên gia nhập?' } = sectionProps;

  const [items, setItems] = useState([]);

  // Initialize items from props or fallback to defaults using valid materialToFA keys
  useEffect(() => {
    if (sectionProps.items && sectionProps.items.length > 0) {
      setItems(sectionProps.items);
    } else {
      setItems([
        { title: 'Lương thưởng cạnh tranh', desc: 'Lương tháng 13 + thưởng hiệu quả dự án định kỳ.', icon: 'payments' },
        { title: 'Môi trường Hybrid', desc: 'Làm việc linh hoạt 2 ngày tại nhà mỗi tuần.', icon: 'apartment' },
        { title: 'Lộ trình thăng tiến', desc: 'Review lương 2 lần/năm với lộ trình rõ ràng.', icon: 'trending_up' },
        { title: 'Sức khỏe toàn diện', desc: 'Bảo hiểm sức khỏe cao cấp cho cả gia đình.', icon: 'security' },
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

  return (
    <div style={{
      background: settings.backgroundColorOverride || `${primaryColor}06`,
      padding: `${settings.paddingTop || 64}px 40px ${settings.paddingBottom || 64}px`,
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: textColor, marginBottom: '40px' }}>
        {headline}
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px',
        maxWidth: '700px', margin: '0 auto',
      }}>
        {items.filter(b => b.isVisible !== false).map((b, i) => (
          <div key={i} style={{
            background: backgroundColor,
            borderRadius: `${borderRadius}px`,
            padding: '28px 24px',
            textAlign: 'left',
            boxShadow: shadowMap[shadow],
            border: '1px solid rgba(0,0,0,0.06)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ 
                fontSize: '28px', 
                color: primaryColor,
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${primaryColor}15`,
                borderRadius: '8px'
              }}>
                <FontAwesomeIcon icon={resolveIcon(b.icon)} />
              </div>

            </div>
            
            <div style={{ fontSize: '16px', fontWeight: 700, color: textColor, marginBottom: '6px' }}>
              {b.title}
            </div>
            <div style={{ fontSize: '13px', color: textColor, opacity: 0.6, lineHeight: 1.6 }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EVPSection;
