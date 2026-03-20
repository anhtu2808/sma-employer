import React, { useState } from 'react';
import { Form, Select, Input, Switch, Divider, message } from 'antd';
import Button from '@/components/Button';
import { useGetJobQuestionsQuery, useCreateJobQuestionMutation } from '@/apis/jobApi';

const ScreeningQuestions = () => {
    const { data: questionsData, isLoading: isQuestionsLoading, isError } = useGetJobQuestionsQuery();
    const [createJobQuestion, { isLoading: isCreating }] = useCreateJobQuestionMutation();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newIsRequired, setNewIsRequired] = useState(false);

    // Map API data to Select options — gracefully handle errors
    const rawQuestions = questionsData?.data || questionsData || [];
    const questionOptions = (Array.isArray(rawQuestions) ? rawQuestions : []).map(q => ({
        value: q.id,
        label: q.question,
    }));

    const handleCreateQuestion = async () => {
        if (!newQuestion.trim()) {
            message.warning('Please enter a question');
            return;
        }

        try {
            await createJobQuestion({
                question: newQuestion.trim(),
                isRequired: newIsRequired,
                description: newDescription.trim() || undefined,
            }).unwrap();
            message.success('Question created successfully!');
            setNewQuestion('');
            setNewDescription('');
            setNewIsRequired(false);
            setShowCreateForm(false);
        } catch (error) {
            message.error(error?.data?.message || 'Failed to create question');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">quiz</span>
                    Screening Questions
                </h3>
            </div>

            {/* Select existing questions */}
            <Form.Item name="questionIds" label="Select Questions" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Select screening questions..."
                    className="w-full"
                    loading={isQuestionsLoading}
                    options={questionOptions}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={isQuestionsLoading ? 'Loading...' : isError ? 'Could not load questions. You can create new ones below.' : 'No questions available'}
                />
            </Form.Item>

            <Divider className="!my-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
            </Divider>

            {/* Create new question */}
            {!showCreateForm ? (
                <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                    <span className="material-icons-outlined text-lg">add_circle_outline</span>
                    Create a new question
                </button>
            ) : (
                <div className="p-4 rounded-xl border border-primary/20 bg-orange-50/30 dark:bg-primary/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">New Question</h4>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreateForm(false);
                                setNewQuestion('');
                                setNewDescription('');
                                setNewIsRequired(false);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">close</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Question <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g. How many years of experience do you have?"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <Input.TextArea
                            placeholder="Optional description or instructions for this question..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={2}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Switch
                                size="small"
                                checked={newIsRequired}
                                onChange={setNewIsRequired}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Required question</span>
                        </div>

                        <Button
                            mode="primary"
                            size="sm"
                            shape="round"
                            loading={isCreating}
                            onClick={handleCreateQuestion}
                        >
                            Create Question
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScreeningQuestions;
