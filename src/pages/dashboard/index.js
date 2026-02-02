import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const StatsCard = ({ icon, iconBg, iconColor, trend, trendUp, label, value }) => (
  <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-icons-outlined">{icon}</span>
      </div>
      <span className={`text-xs font-medium ${trendUp ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'} py-1 px-2 rounded-lg flex items-center`}>
        <span className="material-icons-outlined text-xs mr-1">{trendUp ? 'trending_up' : 'trending_down'}</span>
        {trend}
      </span>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
  </div>
);

const RecruiterRow = ({ avatar, name, role, department, performance, performanceColor, status, statusColor, statusBg, online }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            alt="Recruiter"
            className="h-10 w-10 rounded-full object-cover"
            src={avatar}
          />
          <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${online === 'online' ? 'bg-green-400' : online === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{department}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${performanceColor} rounded-full`} style={{ width: `${performance}%` }}></div>
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{performance}%</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <Button btnIcon mode="ghost" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <span className="material-icons-outlined">more_vert</span>
      </Button>
    </td>
  </tr>
);

// Top Performer Item Component
const TopPerformerItem = ({ rank, avatar, name, stats, isFirst }) => (
  <div className={`flex items-center gap-4 p-3 ${isFirst ? 'rounded-xl bg-orange-50 dark:bg-primary/5 border border-orange-100 dark:border-primary/10' : ''}`}>
    <span className={`${isFirst ? 'text-primary' : 'text-gray-400'} font-bold text-lg w-4 text-center`}>{rank}</span>
    <img
      alt="Top performer"
      className={`h-10 w-10 rounded-full object-cover ${isFirst ? 'ring-2 ring-white dark:ring-gray-800' : ''}`}
      src={avatar}
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{stats}</p>
    </div>
    {isFirst && (
      <div className="text-primary">
        <span className="material-icons-outlined">emoji_events</span>
      </div>
    )}
  </div>
);

// Upcoming Event Component
const UpcomingEvent = ({ month, day, title, time, attendees, bgColor, textColor }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
    <div className={`w-12 h-12 rounded-xl ${bgColor} ${textColor} flex flex-col items-center justify-center flex-shrink-0`}>
      <span className="text-xs font-bold uppercase">{month}</span>
      <span className="text-lg font-bold">{day}</span>
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{time}</p>
      {attendees && (
        <div className="flex -space-x-2 overflow-hidden mt-2">
          {attendees.map((url, index) => (
            <img
              key={index}
              alt=""
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
              src={url}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const statsData = [
    {
      icon: 'group',
      iconBg: 'bg-orange-50 dark:bg-primary/10',
      iconColor: 'text-primary',
      trend: '12%',
      trendUp: true,
      label: 'Total Recruiters',
      value: '24'
    },
    {
      icon: 'work',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '8%',
      trendUp: true,
      label: 'Active Jobs',
      value: '142'
    },
    {
      icon: 'event_available',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: '2%',
      trendUp: false,
      label: 'Interviews Scheduled',
      value: '86'
    },
    {
      icon: 'check_circle',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      trend: '24%',
      trendUp: true,
      label: 'Hires this Month',
      value: '18'
    }
  ];

  const recruitersData = [
    {
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNZTNN7OGtZxewQ1jW7uewFqz5TjXVnla41OySb5QQoio1UAd29LmE9yTYoOZQks4dKNOUfpnPvWmHOoOblk9Z_q6sA-zS5sAtNFE8sZmOUbcpMPl2dotQ9WjMyXIu1E2S_A0BQRoay5rEc3yGEPu2h3AV16CaiqJf846Qoq1qx719k4hK6M3HrIB3vvvV14Be47i3qeYnw9Fl8hwEzXRLr5T9NNBFnJNbOsjPa2hz98wqEjA30thKlpO4X8e1xwsOpbYUSx0dKmvr',
      name: 'Ashton Kucher',
      role: 'Senior Recruiter',
      department: 'Engineering',
      performance: 85,
      performanceColor: 'bg-primary',
      status: 'Available',
      statusColor: 'text-green-800 dark:text-green-300',
      statusBg: 'bg-green-100 dark:bg-green-900/30',
      online: 'online'
    },
    {
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJwCWXK9rAwNRL_pBwY_iLpotjTFVpaQZLPvevF5vQ6IRapSV0ygigsFdbPhUKLsj6p7bK_gcpLwiaxO34w34mMtQE609FYaxJkXA775F4s4Q43BI-FnjyKFfz9soZyFHPEchpaxKlOJwCeY2UA8lGP91V97IhOrfKgMywbpyqkaenT6keG3THhmFO4JWCVDPvI4dw0mL1BXdkG0TxoJccsTCCIEGGd8nFQJnrVRTuha8gDnuxgkXR3nKLMF1zrG5oRvDJyD0OdVz4',
      name: 'Laura Charllote',
      role: 'Tech Recruiter',
      department: 'Product Design',
      performance: 92,
      performanceColor: 'bg-blue-500',
      status: 'In Interview',
      statusColor: 'text-yellow-800 dark:text-yellow-300',
      statusBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      online: 'busy'
    },
    {
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8nzKlHoJ_YiK-v9eE_ibkbuDou_q_1TnkTmbEKmwNkVkKKVUMPDvDQ1Pht9S3avbXMaUKw2ohsEk0uzqigWjkFC4SQkcGH_QjV7Wu2g8uLAMo_3VGixikhV4WLsOuu0cbfQAlXOXPA2nlwZgz4UTwAYCnzu4IzzA6xzmqCbK5KB7N9ZVWrMsrB2maJ7F0hl8UuWNTdyS7O1G8xiAhOfjTC6Wnzp7CrhYoEHsjCAej-gsdX_elJFr6F2-h34GK1VZHmi82TKKlaBez',
      name: 'Mike Johnson',
      role: 'Recruiting Coord.',
      department: 'Operations',
      performance: 65,
      performanceColor: 'bg-yellow-500',
      status: 'Offline',
      statusColor: 'text-gray-800 dark:text-gray-300',
      statusBg: 'bg-gray-100 dark:bg-gray-700',
      online: 'offline'
    },
    {
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYHVZX6apdWoeA_DotpzQxncGC_EKaqpnIMbNKNMXcbU3LwA2FoqfkzcKwT7EVSCVt3Qf9vOZC86UwbYYNiei81dxwvgWw3AarQCo-OMpgn7KN7JjJgDM7nT9UgXeA7cNRcVpJSH9kWDyYlodaFrtdFL6-uu9ZSlp7TMO_3CWUaW_QjB08zlkpV3rSMf-U57-j7y2K1VKwpR-jKt4ANg7iIy_PUDJbazIkuA6Lyc_tQFNmAAkkmk1Jfyn9yaaHYOmlXSuPZkiElbjk',
      name: 'Emily Chen',
      role: 'Marketing Recruiter',
      department: 'Marketing',
      performance: 78,
      performanceColor: 'bg-primary',
      status: 'Available',
      statusColor: 'text-green-800 dark:text-green-300',
      statusBg: 'bg-green-100 dark:bg-green-900/30',
      online: 'online'
    }
  ];

  const topPerformers = [
    {
      rank: 1,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcpR7z2A8nGKEiyz64l0NP4RXJEwCeNZlUNAWEVILLAKQwowetbiqZn48HkHYNcmadUWprNbJ2u39pwdRknBR-bu6FZHfiZkzOLtKJWq7fpUsUMtiSXjPuQkkxZCg53kB-XuC0AQGKDTanISaIuMnIRmzh3vpydUk6yv7tnS0IoREZIuGL7tWssxUqhlvlFNYW8Aju3FuXpRnYWfjEILwZKrLp6L_pohHvTxprevDy2v0Q4lxcogziDbX_bEYXTi9aix02jf7IJoC0',
      name: 'Laura Charllote',
      stats: '12 Hires • 98% CSAT'
    },
    {
      rank: 2,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Pgewlz95OrA8VvtZVY10VVsNQQ6dNvmv-QEl6KbqxZGJdlBvA3E9UnTFyUECcqshciVtcxHNRNAD-VXphvv4LABMXYl9sPp0l1OZNiT5LaT4sXSH2FaE3s2IUpGlEOTajWwrr05_XnKjBvnMwD6bP9CTD57aI4oYMY46SnTvBi6nv4nwCzCszJdyGhxFcFhMEsuyhKNs9YVkxqE1okxd0O3hbpk6qfEJ_6wmvOVs1em3D1qXZmq3zNtX3dVbStKFs8qDKM9wrzxw',
      name: 'Ashton Kucher',
      stats: '9 Hires • 95% CSAT'
    },
    {
      rank: 3,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo5wRMZE9KlRZ1abb45KLnYheDcX92kBuGOYyvbg2ZSwwrjKu0x6twfkMAOscvn8xJ5xpAT9IPHNdAFwT8Bfe52PU2lKUHxX5D_FnrDGiEIWY6npz0g5jCJKOWZq7vd37D786fCql02MUKs7HYy_S6hZc7MqPBB35i_AaZyq27eZyneuLyKzXTmIGp96A00mHdBTG1SiFVy9-4fseb8MdGYqc3ruTp4kGw2FSRuX_DKYLZ8hPhGEhn2kzGPUZ804KGSGXiQ2ch36oR',
      name: 'Emily Chen',
      stats: '8 Hires • 92% CSAT'
    }
  ];

  const upcomingEvents = [
    {
      month: 'Sep',
      day: '14',
      title: 'Product Designer Interview',
      time: '10:00 AM - 11:30 AM',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      attendees: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5FRqDLMomoJTcdcRdyS4LWIETI_9zaD4idFaKPTEy9EX1gTbOkTP65G-3lYooTYR_d0LV5p7HDyFGmEDfpzkiUn8eZcYNze-mp5tnzEyTap7VIQTYe7dIsy-XowYKGpH1NDzxSGvtOMuxlsB6Fw5AzXyvXE-VbsS7qtXZcQNT_2_zEdxIBRkX2O3UXDV794_vA05p335Ix_foTkHI8IK4IXEpKLBhqQGkQslJZe3E6smDwNkQR-2nyCa-AAZnBuJE2TCplJffK0B',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBhyoXBuM8LY-9rcfq7a8p-92ej1OV2qyhZjxrMIZsxDUME4UBCxqSk80xD-JeJrMtsBoamYPaof9vXQ-c7yYQIKMfx6u8xm-SVQKwchRuuQSDoisqrbHQj31_dz_wbTKTOvIsydURxRgwwLXMltcnlWlHr86w6NGA-zeYd5xCJKc1iBFZl2a4McBnVoJ_D17qpxvxdRAQ3Omel8alTyeRz2qFxslU7V_x4MMTTB9lqJwIBJ_0IR5DF4SvcV-HKOAPcUSiddvLtALrI'
      ]
    },
    {
      month: 'Sep',
      day: '14',
      title: 'Frontend Dev Screening',
      time: '02:00 PM - 02:45 PM',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      attendees: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBvttm7nM7Y1JBfqjB72diQvXNnyRhIZhdNsLk_yPFdokIMhV6OooLij99u-vjmzUMBfnQhvyKVQkrwAy30pkkU5fW9gXoYjDLFZJjYRPK-kZdtv-G0aXNS9trrrJqxDGKnyVWdiIiz3c6QJa3FFtLpWeZQtKcgSAxmo7iehNkjnLKHgnIkTcgXRDooawiLIfmxOFLDWgfPU5f9aUXbiuxY4hpSXSZptQOKUU6TOw3exn4FdWe-tBfX1c_SvUFvlqNEuwfZANnqGrgH'
      ]
    }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">Welcome back, Sarah!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Here's what's happening with your recruiting team today.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            {/* Mobile: Icon only buttons */}
            <div className="flex gap-2 sm:hidden">
              <Button 
                btnIcon
                mode="secondary"
                shape="rounded"
                size="sm"
                className="bg-white dark:bg-gray-800"
                title="Filter"
              >
                <span className="material-icons-outlined text-base">filter_list</span>
              </Button>
              <Button 
                btnIcon
                mode="primary" 
                shape="rounded"
                size="sm"
                title="Add Recruiter"
              >
                <span className="material-icons-outlined text-base">add</span>
              </Button>
            </div>
            
            {/* Desktop: Buttons with text */}
            <div className="hidden sm:flex gap-3">
              <Button 
                mode="secondary"
                shape="rounded"
                size="sm"
                className="bg-white dark:bg-gray-800"
                iconLeft={<span className="material-icons-outlined text-base">filter_list</span>}
              >
                Filter
              </Button>
              <Button 
                mode="primary" 
                shape="rounded"
                size="sm"
                iconLeft={<span className="material-icons-outlined text-base">add</span>}
              >
                Add Recruiter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recruiter Performance Table */}
        <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recruiter Performance</h3>
            <Link to="/recruiters" className="text-sm text-primary hover:text-primary-hover font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400" scope="col">Recruiter</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400" scope="col">Department</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400" scope="col">Performance</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400" scope="col">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400" scope="col"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recruitersData.map((recruiter, index) => (
                  <RecruiterRow key={index} {...recruiter} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Performers */}
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
              <Button btnIcon mode="ghost" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <span className="material-icons-outlined">more_horiz</span>
              </Button>
            </div>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <TopPerformerItem key={index} {...performer} isFirst={index === 0} />
              ))}
            </div>
            <Button fullWidth mode="ghost" className="mt-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              View Leaderboard
            </Button>
          </div>

          {/* Upcoming Events */}
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming</h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <UpcomingEvent key={index} {...event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
