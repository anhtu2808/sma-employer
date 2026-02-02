import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title = 'Dashboard', onMobileMenuClick }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="h-16 sm:h-20 bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <span className="material-icons-outlined">menu</span>
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl px-4 lg:px-8">
        <div className="relative group w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <span className="material-icons-outlined">search</span>
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-colors"
            placeholder="Search recruiters, jobs, or candidates..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/ui-kit"
          className="p-2 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
          title="UI Kit"
        >
          <span className="material-icons-outlined">palette</span>
        </Link>

        <button className="p-2 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors relative">
          <span className="material-icons-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Sarah Wilson</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Head of Talent</p>
          </div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEH8DYTzMMQiZnm_iy5mL-yY2n7Rvq6SsI6n2_zwGLU0XFMVSz1PiEK-bOUFHsj-fplhI1l4XvZGDlZwDDGlg5nhiafEpOIySdsPLjyBWlftuziXVTBbYuIzX-1ZAVw71ke3_67dbC6uFapWOZkM62V7lUOEek2ZZP9Ti0F472l_GdlsYg2j7TTHh1UGrKnQnV5L3wFmtcwCPkoKWOvYKpU0Nf9yNfP5jjgWPZ4ghrRqz6wlkbVAyeqVe29gi-owRwvwbAME2rg2Iv"
            alt="User avatar"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
