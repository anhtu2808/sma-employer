import React from 'react';
import { Link } from 'react-router-dom';
import smaLogo from '@/assets/svg/sma-logo.svg';
import smaLogoWhite from '@/assets/svg/sma-logo-white.svg';

const Logo = ({
  className = '',
  iconColor = '',
  collapsed = false,
  textColor = '',
  showHover = true,
  size = 'normal'
}) => {
  const logoSizes = {
    normal: collapsed ? 'w-6 h-6' : 'w-7 h-7',
    large: collapsed ? 'w-8 h-8' : 'w-9 h-9',
  };

  const textSizes = {
    normal: 'text-base',
    large: 'text-xl',
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${showHover ? 'group' : ''} ${collapsed ? 'justify-center' : ''} ${className}`}>
      <img
        src={iconColor === 'white' ? smaLogoWhite : smaLogo}
        alt="SmartRecruit Logo"
        className={`${iconColor || 'text-primary'} ${logoSizes[size] || logoSizes.normal}`}
      />
      {!collapsed && (
        <span className={`font-bold transition-colors ${textSizes[size] || textSizes.normal} ${textColor || 'text-gray-900 dark:text-white'} ${showHover ? 'group-hover:text-primary' : ''}`}>
          SmartRecruit
        </span>
      )}
    </Link>
  );
};

export default Logo;
