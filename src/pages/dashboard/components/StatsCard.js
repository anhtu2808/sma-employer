import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ icon, iconBg, iconColor, label, value, linkTo, isLoading }) => (
  <Link to={linkTo} className="block group">
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
        <span className="material-icons-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">arrow_forward</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      {isLoading ? (
        <div className="h-9 mt-1 flex items-center"><div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></div>
      ) : (
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      )}
    </div>
  </Link>
);

export default StatsCard;
