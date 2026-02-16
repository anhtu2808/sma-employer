import React from 'react';
import { message } from 'antd';
import Form from '@/components/Form';
import Button from '@/components/Button';
import { useCreateJobMutation } from '@/apis/jobApi';
import { useNavigate } from 'react-router-dom';

// Components
import JobIdentity from './components/JobIdentity';
import RoleDefinition from './components/RoleDefinition';
import WorkCompensation from './components/WorkCompensation';
import JobDescriptionSection from './components/JobDescriptionSection';
import PublishCard from './components/PublishCard';
import ScoringWeights from './components/ScoringWeights';
import ProTips from './components/ProTips';
import JobSettings from './components/JobSettings'; // Keep for extra settings if needed, or remove if unused. 
// Actually, JobSettings had 'Application Deadline', 'Number of Openings', 'Auto-Reject'. 
// These fit well in a 'Job Settings' section, maybe under Work & Comp or in the sidebar?
// The image doesn't explicitly show them. I will put them at the bottom of the main col for now.
import Classification from './components/Classification';
import ScreeningQuestions from './components/ScreeningQuestions';

const JobCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [createJob, { isLoading }] = useCreateJobMutation();

    const onFinish = async (values) => {
        try {
            const scoringCriterias = [
                { criteriaId: 1, weight: values.weight_1 || 0, enable: values.enableAiScoring },
                { criteriaId: 2, weight: values.weight_2 || 0, enable: values.enableAiScoring },
                { criteriaId: 3, weight: values.weight_3 || 0, enable: values.enableAiScoring },
            ];

            const totalWeight = scoringCriterias.reduce((sum, item) => sum + item.weight, 0);
            if (values.enableAiScoring && totalWeight !== 100) {
                message.error(`Total scoring weight must be 100%. Current: ${totalWeight}%`);
                return;
            }

            const submitData = {
                ...values,
                expDate: values.expDate ? values.expDate.toISOString() : null,
                scoringCriterias,
                skillIds: values.skillIds || [],
                domainIds: values.domainIds || [],
                benefitIds: values.benefitIds || [],
                questionIds: values.questionIds || [],
                locationIds: values.locationIds || [],
                salaryStart: Number(values.salaryStart) || 0,
                salaryEnd: Number(values.salaryEnd) || 0,
                experienceTime: Number(values.experienceTime) || 0,
                quantity: Number(values.quantity) || 1, // Default to 1 if not set
                autoRejectThreshold: Number(values.autoRejectThreshold) || 0,
                expertiseId: values.expertiseId || 0,
                rootId: 0, // Default as per requirement
            };

            // Remove temporary fields
            delete submitData.weight_1;
            delete submitData.weight_2;
            delete submitData.weight_3;

            await createJob(submitData).unwrap();
            message.success('Job published successfully!');
            navigate('/jobs');
        } catch (error) {
            console.error('Failed to create job:', error);
            message.error('Failed to create job. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-[95%] mx-auto pb-20">
            <Button
                mode="text"
                className="mb-4 text-gray-500 hover:text-primary pl-0"
                onClick={() => navigate('/jobs')}
                iconLeft={<span className="material-icons-round text-lg">arrow_back</span>}
            >
                Back
            </Button>

            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="block"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <JobIdentity />
                        <JobDescriptionSection />
                        <WorkCompensation />
                        <Classification />
                        <RoleDefinition />
                        <ScreeningQuestions />

                        {/* Additional Settings (Optional but important) */}
                        <div className="pt-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Settings</h3>
                            <JobSettings />
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <PublishCard onCancel={() => navigate('/jobs')} isLoading={isLoading} />
                        <ScoringWeights />
                        <ProTips />
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default JobCreate;
