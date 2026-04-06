import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faYoutube,
  faGithub,
  faTiktok,
  faPinterestP,
  faDiscord,
  faTelegram,
  faWhatsapp,
  faThreads,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const SOCIAL_ICON_MAP = {
  facebook: { icon: faFacebookF, color: '#1877F2' },
  twitter: { icon: faTwitter, color: '#1DA1F2' },
  linkedin: { icon: faLinkedinIn, color: '#0A66C2' },
  instagram: { icon: faInstagram, color: '#E4405F' },
  youtube: { icon: faYoutube, color: '#FF0000' },
  github: { icon: faGithub, color: '#fff' },
  tiktok: { icon: faTiktok, color: '#fff' },
  pinterest: { icon: faPinterestP, color: '#E60023' },
  discord: { icon: faDiscord, color: '#5865F2' },
  telegram: { icon: faTelegram, color: '#26A5E4' },
  whatsapp: { icon: faWhatsapp, color: '#25D366' },
  threads: { icon: faThreads, color: '#fff' },
};

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
    { icon: 'linkedin', url: '#' },
    { icon: 'facebook', url: '#' },
    { icon: 'github', url: '#' },
  ];

  return (
    <div style={{ background: footerConfig.backgroundColorOverride || '#1a1a2e', padding: '48px 40px', color: footerConfig.textColorOverride || '#fff' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '40px', maxWidth: '960px', margin: '0 auto',
      }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            {footerConfig.logoUrl ? (
              <img
                src={footerConfig.logoUrl}
                alt={companyName}
                style={{ height: `${footerConfig.logoHeight || 32}px`, objectFit: 'contain' }}
              />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: primaryColor, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`,
              }}>
                {companyName ? companyName.substring(0, 2).toUpperCase() : 'AC'}
              </div>
            )}
            <span style={{ fontWeight: 700, fontSize: `${15 * ((theme.baseFontSize || 16) / 16)}px` }}>{companyName}</span>
          </div>
          {contact?.email && (
            <p style={{ fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`, opacity: 0.7, marginBottom: '8px' }}>
              ✉ {contact.email}
            </p>
          )}
          {contact?.phone && (
            <p style={{ fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`, opacity: 0.7, marginBottom: '8px' }}>
              ☎ {contact.phone}
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {defaultSocials.map((s, i) => {
              const socialDef = SOCIAL_ICON_MAP[s.icon];
              const faIcon = socialDef?.icon || faGlobe;
              const iconColor = socialDef?.color || 'rgba(255,255,255,0.5)';
              return (
                <a
                  key={s.icon || i}
                  href={s.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconColor,
                    fontSize: `${15 * ((theme.baseFontSize || 16) / 16)}px`,
                    transition: 'background 0.2s, transform 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FontAwesomeIcon icon={faIcon} />
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: '400px', textAlign: 'right' }}>
          <div style={{ fontSize: `${14 * ((theme.baseFontSize || 16) / 16)}px`, fontWeight: 700, marginBottom: '16px' }}>Our Locations</div>
          {contact?.addresses && contact.addresses.map((addr, i) => (
            <p key={`addr-${i}`} style={{ fontSize: `${13 * ((theme.baseFontSize || 16) / 16)}px`, opacity: 0.7, lineHeight: 1.6, marginBottom: '10px' }}>
              {addr}
            </p>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid currentColor',
        opacity: 0.5,
        marginTop: '36px', paddingTop: '20px',
        textAlign: 'center', fontSize: `${12 * ((theme.baseFontSize || 16) / 16)}px`,
      }}>
        {copyrightText}
      </div>
    </div>
  );
};

export default FooterSection;
