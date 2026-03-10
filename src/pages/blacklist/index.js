import React, { useState } from 'react';
import { useGetBlacklistQuery, useUnblockCandidateMutation } from '@/apis/companyApi';
import { Table, Input, Tag, Space, Button, message, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import Pagination from '@/components/Pagination';

const CompanyBlacklist = () => {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const size = 10;

    const { data: response, isLoading } = useGetBlacklistQuery({
        keyword,
        page,
        size,
        sort: 'blockDate,desc'
    });

    const [unblockCandidate, { isLoading: isUnblocking }] = useUnblockCandidateMutation();

    const handleUnblock = async (candidateId) => {
        try {
            await unblockCandidate(candidateId).unwrap();
            message.success('Candidate has been removed from blacklist');
        } catch (error) {
            message.error(error?.data?.message || 'Failed to unblock candidate');
        }
    };

    return (
        <main className="flex-1 overflow-y-auto custom-scroll">
            <div className="max-w-7xl mx-auto space-y-4">

                {/* Action Bar  */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-gray-200 shadow-sm">
                    <div className="relative max-w-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                        </div>
                        <input
                            className="block w-full h-11 pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all shadow-inner"
                            placeholder="Search name, email or reason..."
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
                            <span className="material-symbols-outlined text-[18px] fill-1">dangerous</span>
                            <span className="text-sm font-bold tracking-tight">
                                {response?.data?.totalElements || 0} Blocked Candidates
                            </span>
                        </div>

                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[24px] border border-gray-200 shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Candidate</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">By</th>
                                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-gray-500 tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr><td colSpan="5" className="text-center py-20 text-gray-400 font-medium italic">Loading your blacklist...</td></tr>
                                ) : response?.data?.content?.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-20 text-gray-400 font-medium">No candidates in blacklist</td></tr>
                                ) : response?.data?.content?.map((item) => (
                                    <tr key={item.candidateId} className="table-row-hover transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-red-600 font-bold border border-red-100 shadow-sm">
                                                    {item.fullName?.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900 leading-tight">{item.fullName}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 max-w-[280px] line-clamp-2 leading-relaxed" title={item.reason}>
                                                {item.reason}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{dayjs(item.blockDate).format('MMM DD, YYYY')}</div>
                                            <div className="text-[11px] text-gray-400 font-medium uppercase mt-0.5">{dayjs(item.blockDate).format('hh:mm A')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">shield_person</span>
                                                {item.createdBy || "System"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Popconfirm
                                                title="Unblock candidate?"
                                                description="They will be allowed to apply again."
                                                onConfirm={() => handleUnblock(item.candidateId)}
                                                okText="Unblock"
                                                cancelText="Cancel"
                                                okButtonProps={{ danger: true, className: "rounded-lg" }}
                                                cancelButtonProps={{ className: "rounded-lg" }}
                                            >
                                                <button className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-bold text-xs bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-all group ml-auto">
                                                    <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-500">sync</span>
                                                    Unblock
                                                </button>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <Pagination
                            currentPage={page}
                            totalPages={response?.data?.totalPages || 0}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CompanyBlacklist;