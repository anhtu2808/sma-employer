import React from 'react';

const HeaderSection = ({ theme, headerConfig = {} }) => {
  const { primaryColor, textColor, borderRadius, buttonStyle } = theme;
  const {
    logoUrl,
    logoHeight = 40,
    navLinks = [],
    ctaButton = {},
    companyName = 'Acme Corp',
  } = headerConfig;

  const defaultNavLinks = navLinks.length > 0 ? navLinks : [
    { label: 'About Us' },
    { label: 'Careers' },
    { label: 'Benefits' },
    { label: 'Blog' },
  ];

  const btnBase = {
    padding: '8px 20px',
    borderRadius: `${borderRadius}px`,
    fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const btnStyles = {
    filled: { ...btnBase, background: primaryColor, color: '#fff', border: 'none' },
    flat: { ...btnBase, background: primaryColor, color: '#fff', border: 'none' },
    outline: { ...btnBase, background: 'transparent', color: primaryColor, border: `2px solid ${primaryColor}` },
    shadow: { ...btnBase, background: primaryColor, color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' },
    ghost: { ...btnBase, background: 'transparent', color: primaryColor, border: 'none' },
  };

  const initials = companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      background: headerConfig.backgroundColorOverride || '#FFFFFF',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ height: `${logoHeight}px`, objectFit: 'contain' }} />
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: primaryColor, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`,
          }}>
            {initials}
          </div>
        )}
        <span style={{ fontWeight: 700, fontSize: `${16 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor }}>{companyName}</span>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {defaultNavLinks.filter(link => link.isVisible !== false).map((link, i) => (
          <span key={i} style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, color: textColor, opacity: 0.7, cursor: 'pointer' }}>
            {link.label}
          </span>
        ))}
        {(ctaButton.isVisible !== false) && (
          <button style={btnStyles[buttonStyle] || btnStyles.filled}>
            {ctaButton.text || 'Apply Now'}
          </button>
        )}
      </nav>
    </div>
  );
};

export default HeaderSection;
