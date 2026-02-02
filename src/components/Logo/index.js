import React from 'react';
import { Link } from 'react-router-dom';
import smaLogo from '@/assets/svg/sma-logo.svg';
import smaLogoWhite from '@/assets/svg/sma-logo-white.svg';

const Logo = ({ className = '', iconColor = '', collapsed = false }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${collapsed ? 'justify-center' : ''} ${className}`}>
      <img
        src={iconColor === 'white' ? smaLogoWhite : smaLogo}
        alt="SmartRecruit Logo"
        className={`${iconColor || 'text-primary'} ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`}
      />
      {!collapsed && (
        <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          SmartRecruit
        </span>
      )}
    </Link>
  );
};

export default Logo;
