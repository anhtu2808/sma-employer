import React from 'react';

const UserProfileCard = ({ isLoading, recruiterName, recruiterEmail, recruiterAvatar, companyLocation, joinDate }) => (
  <div className="mb-6 sm:mb-8 bg-card-light dark:bg-card-dark rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
      {/* Avatar */}
      {isLoading ? (
        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
      ) : recruiterAvatar ? (
        <img src={recruiterAvatar} alt={recruiterName} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xl font-bold text-white">
            {recruiterName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        {isLoading ? (
          <>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </>
        ) : (
          <>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Welcome back, {recruiterName}!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Here is what's happening with your recruitment activities today.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
              {companyLocation && (
                <span className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm text-primary">location_on</span>
                  {companyLocation}
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm text-primary">calendar_today</span>
                  Joined {new Date(joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
              {recruiterEmail && (
                <span className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm text-primary">mail</span>
                  {recruiterEmail}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

export default UserProfileCard;
