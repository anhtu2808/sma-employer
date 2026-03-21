import React from 'react';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, linkTo, linkLabel = 'View All' }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    {linkTo && (
      <Link to={linkTo} className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1">
        {linkLabel}
        <span className="material-icons-outlined text-sm">arrow_forward</span>
      </Link>
    )}
  </div>
);

export default SectionHeader;
