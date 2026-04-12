import React from 'react';
import { Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSliders, faChevronRight, faCircleCheck
} from '@fortawesome/free-solid-svg-icons';

const RECRUITEE_LOGO = "https://recruitee.com/hubfs/raw_assets/public/Tellent_Theme_V3/bright/templates/assets/logo/tellent-logo.svg";

const IntegrationMenu = ({ config, onConnectRecruitee }) => {
    // ĐIỀU KIỆN MỚI: Chỉ tính là Active Linked khi cả 2 đều true
    const isActive = config?.isConnected && config?.isAutoSync;
    const isConnected = config?.isConnected;

    const content = (
        <div className="w-[320px]  dark:border-gray-800 overflow-hidden font-body">
            <div className=" border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-neutral-800/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Sources</span>
            </div>

            <div className="p-2">
                <div
                    onClick={onConnectRecruitee}
                    className="group flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-all border border-transparent"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-100 p-1.5 rounded-lg flex items-center justify-center shadow-sm">
                            <img src={RECRUITEE_LOGO} alt="Recruitee" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                Recruitee
                                {isActive && <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-[12px]" />}
                            </div>
                            <div className="text-[10px] text-gray-500">Tellent candidate sync</div>
                        </div>
                    </div>
                    {isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[9px] font-black border border-green-100">ACTIVE</span>
                    ) : isConnected ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black border border-amber-100">PAUSED</span>
                    ) : (
                        <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 group-hover:text-gray-500 text-[10px]" />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            placement="bottomRight"
            overlayClassName="custom-popover"
        >
            <button
                type="button"
                className={`flex items-center gap-2 px-4 h-10 rounded-xl border font-bold text-xs transition-all ${isActive
                    ? 'bg-green-50 border-green-200 text-green-600'
                    : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                    }`}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="uppercase tracking-tight">
                    {isActive ? 'Recruitee Linked' : 'Integrations'}
                </span>
                <FontAwesomeIcon icon={faSliders} className={isActive ? 'text-green-600' : 'text-gray-400'} />
            </button>
        </Popover>
    );
};

export default IntegrationMenu;