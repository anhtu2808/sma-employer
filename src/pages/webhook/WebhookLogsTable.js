import React, { useState } from 'react';
import { useGetWebhookLogsQuery } from '@/apis/webhookApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faCircleXmark,
    faClock,
    faLink, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Pagination, ConfigProvider, Tooltip } from 'antd';

const WebhookLogsTable = ({ webhookId }) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const { data, isLoading } = useGetWebhookLogsQuery(
        { id: webhookId, page, size },
        { skip: !webhookId }
    );

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading delivery logs...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-neutral-900">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-neutral-800/50 text-gray-500 dark:text-gray-400 text-[11px] tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4 text-left">Webhook Name</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Event</th>
                            <th className="px-6 py-4 text-left">Message</th>
                            <th className="px-6 py-4 text-left">Duration</th>
                            <th className="px-6 py-4 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data?.data?.content?.length > 0 ? (
                            data.data.content.map((log) => {
                                const isSuccess = log.statusCode >= 200 && log.statusCode < 300;
                                return (
                                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">

                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faLink} className="text-[10px] text-gray-400" />
                                                {log.webhookName || 'Unknown Webhook'}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${isSuccess
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                <FontAwesomeIcon icon={isSuccess ? faCheckCircle : faCircleXmark} />
                                                {log.statusCode === 0 ? 'FAIL' : log.statusCode}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-mono text-[12px] text-gray-700 dark:text-gray-300">
                                            {log.eventName}
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px]">
                                            <Tooltip title={log.errorMessage}>
                                                <div className={`text-xs truncate ${isSuccess ? 'text-gray-400' : 'text-red-500 font-medium'}`}>
                                                    {!isSuccess && <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1.5" />}
                                                    {log.errorMessage || 'No message'}
                                                </div>
                                            </Tooltip>
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            <FontAwesomeIcon icon={faClock} className="mr-1.5 opacity-50" />
                                            {log.durationMs || 0}ms
                                        </td>

                                        <td className="px-6 py-4 text-right text-gray-400 text-xs font-medium">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">
                                    No logs recorded for this webhook yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end px-2 pt-2">
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#f97316',
                            borderRadius: 8,
                        },
                    }}
                >
                    <Pagination
                        size="small"
                        current={page + 1}
                        pageSize={size}
                        total={data?.data?.totalElements || 0}
                        showSizeChanger={false}
                        onChange={(p) => {
                            setPage(p - 1);
                        }}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
};

export default WebhookLogsTable;