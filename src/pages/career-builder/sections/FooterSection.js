import React from 'react';

const FooterSection = ({ theme, footerConfig = {} }) => {
  const { primaryColor } = theme;
  const {
    companyName = 'Acme Corp',
    address = '',
    contact = {},
    socialLinks = [],
    copyrightText = '© 2026 Acme Corp. All rights reserved.',
  } = footerConfig;

  const defaultSocials = socialLinks.length > 0 ? socialLinks : [
    { platform: 'LinkedIn', url: '#' },
    { platform: 'Facebook', url: '#' },
    { platform: 'GitHub', url: '#' },
  ];

  const linkStyle = { fontSize: '13px', color: '#fff', opacity: 0.5, cursor: 'pointer', lineHeight: 2 };

  return (
    <div style={{ background: '#1a1a2e', padding: '48px 40px', color: '#fff' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '40px', maxWidth: '960px', margin: '0 auto',
      }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: primaryColor, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px',
            }}>AC</div>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>{companyName}</span>
          </div>
          {contact?.email && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
              ✉ {contact.email}
            </p>
          )}
          {contact?.phone && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
              ☎ {contact.phone}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {defaultSocials.map((s) => (
              <span key={s.platform} style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', padding: '4px 10px',
                borderRadius: '4px',
              }}>{s.platform}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: '400px', textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Hệ thống cơ sở</div>
          {contact?.addresses && contact.addresses.map((addr, i) => (
            <p key={`addr-${i}`} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '10px' }}>
              {addr}
            </p>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '36px', paddingTop: '20px',
        textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)',
      }}>
        {copyrightText}
      </div>
    </div>
  );
};

export default FooterSection;
