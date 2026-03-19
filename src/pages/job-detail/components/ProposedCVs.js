import React, { useState } from 'react';
import { useGetProposedCvsQuery } from '../../../apis/jobApi';
import Loading from '@/components/Loading';
import { ChevronLeft, ChevronRight, Eye, ExternalLink, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProposedCVs = ({ jobId }) => {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 0, size: 10 });
  const { data: response, isFetching } = useGetProposedCvsQuery({ id: jobId, ...params }, { skip: !jobId });
  const data = response?.data || { content: [], totalElements: 0, pageNumber: params.page, pageSize: params.size, totalPages: 0 };
  const applications = data.content;
  const totalElements = data.totalElements;
  const totalPages = data.totalPages;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn mt-4">
      {/* Header bar */}
      <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="material-icons-outlined text-primary text-base">auto_awesome</span>
            <span className="font-semibold text-neutral-800 dark:text-white">{totalElements}</span> proposed CVs found
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 320 }}>
        {isFetching ? (
          <Loading className="py-20" size={96} />
        ) : applications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              <Users size={28} className="text-orange-400" />
            </div>
            <p className="text-sm font-semibold text-neutral-500">No proposed CVs yet</p>
            <p className="text-xs text-neutral-400">Recommended candidates will appear here.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-900 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 w-[35%] text-sm font-semibold text-gray-500 tracking-wide">Candidate</th>
                    <th className="px-6 py-4 w-[25%] text-sm font-semibold text-gray-500 tracking-wide">Job Title</th>
                    <th className="px-6 py-4 w-[15%] text-sm font-semibold text-gray-500 tracking-wide">Gender</th>
                    <th className="px-6 py-4 w-[15%] text-sm font-semibold text-gray-500 tracking-wide text-center">AI Match Rate</th>
                    <th className="px-6 py-4 w-[10%] text-center text-sm font-semibold text-gray-500 tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                  {applications.map((app) => (
                    <tr key={app.resumeId} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-200">
                            {app.fullName?.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {app.fullName}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate leading-none mt-1" title={app.address}>
                              <MapPin size={12} className="flex-shrink-0" /> {app.address || 'No address provided'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-neutral-300 font-medium">
                          {app.jobTitle || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${app.gender === 'MALE' ? 'bg-blue-50 text-blue-600' :
                            app.gender === 'FEMALE' ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-600'
                          }`}>
                          {app.gender === 'MALE' ? 'Male' : app.gender === 'FEMALE' ? 'Female' : 'Other'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-semibold ${getScoreColor(app.matchRate)}`}>
                          {app.matchRate ? `${getDisplayRate(app.matchRate)}%` : '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => navigate(`/jobs/${jobId}/proposed-cvs/${app.resumeId}`)}
                            className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                            title="View Profile"
                          >
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 dark:border-neutral-800 bg-white dark:bg-surface-dark flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">
                Showing <span className="text-gray-900 dark:text-white font-semibold">{applications.length}</span> of <span className="text-gray-900 dark:text-white font-semibold">{totalElements}</span> Candidates
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setParams(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                  disabled={params.page === 0}
                  className={`p-2 rounded-xl transition-all ${params.page === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setParams(prev => ({ ...prev, page: index }))}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${params.page === index
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={params.page >= Math.max(0, totalPages - 1)}
                  className={`p-2 rounded-xl transition-all ${params.page >= Math.max(0, totalPages - 1) ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper Components
const getDisplayRate = (rate) => {
  const numericRate = rate || 0;
  return numericRate <= 1 && numericRate > 0
    ? Math.round(numericRate * 100)
    : Math.round(numericRate);
};

const getScoreColor = (score) => {
  if (!score) return 'text-gray-300';
  const percent = getDisplayRate(score);
  if (percent >= 80) return 'text-emerald-500';
  if (percent >= 60) return 'text-orange-500';
  return 'text-red-500';
};

export default ProposedCVs;
