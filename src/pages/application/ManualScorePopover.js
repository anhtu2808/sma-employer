import React, { useState } from 'react';
import { Popover, InputNumber, Button, Tooltip, ConfigProvider } from 'antd';
import { Pencil } from 'lucide-react';
import { useScoreManualMutation } from '@/apis/applicationApi';
import toastMessage from '@/utils/toastMessage';

export const getEffectiveScore = (evaluation) =>
    evaluation?.recruiterScore ?? evaluation?.aiScore;

export const isManualScored = (evaluation) => evaluation?.recruiterScore != null;

export const ManualScoreBadge = ({ evaluation, className = '' }) => {
    if (!isManualScored(evaluation)) return null;
    const aiScore = evaluation?.aiScore;
    const tooltip = aiScore != null ? `AI score: ${Math.round(aiScore)}%` : 'Scored manually by recruiter';
    return (
        <Tooltip title={tooltip}>
            <span
                className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
            >
                Manual
            </span>
        </Tooltip>
    );
};

const ManualScorePopover = ({ evaluation, applicationId, children, disabled, placement = 'bottom' }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(evaluation?.recruiterScore ?? evaluation?.aiScore ?? null);
    const [scoreManual, { isLoading }] = useScoreManualMutation();

    if (!evaluation?.id || disabled) {
        return <>{children}</>;
    }

    const handleSubmit = async () => {
        if (value == null || value < 0 || value > 100) {
            toastMessage.error('Score must be between 0 and 100');
            return;
        }
        try {
            await scoreManual({
                evaluationId: evaluation.id,
                manualScore: Number(value),
                applicationId,
            }).unwrap();
            toastMessage.success('Manual score saved');
            setOpen(false);
        } catch (e) {
            toastMessage.error(e?.data?.message || 'Failed to save manual score');
        }
    };

    const content = (
        <div className="w-60 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Manual score (0-100)
                </label>
                <InputNumber
                    min={0}
                    max={100}
                    step={1}
                    value={value}
                    onChange={setValue}
                    className="w-full"
                    autoFocus
                />
            </div>
            {evaluation?.aiScore != null && (
                <div className="text-xs text-gray-500">
                    AI suggestion: <span className="font-medium">{Math.round(evaluation.aiScore)}</span>
                </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
                <Button size="small" onClick={() => setOpen(false)}>Cancel</Button>
                <ConfigProvider theme={{ token: { colorPrimary: '#f97316' } }}>
                    <Button size="small" type="primary" loading={isLoading} onClick={handleSubmit}>
                        Save
                    </Button>
                </ConfigProvider>
            </div>
        </div>
    );

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            content={content}
            trigger="click"
            placement={placement}
            title={<span className="font-semibold text-sm">Manual score</span>}
            destroyTooltipOnHide
        >
            <span
                role="button"
                className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                <Pencil size={12} className="text-gray-400" />
            </span>
        </Popover>
    );
};

export default ManualScorePopover;
