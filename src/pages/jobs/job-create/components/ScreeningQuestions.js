import React, { useState } from 'react';
import { Form, Select, Input, Switch, Divider, message } from 'antd';
import Button from '@/components/Button';
import { useGetJobQuestionsQuery, useCreateJobQuestionMutation, useUpdateJobQuestionMutation } from '@/apis/jobApi';

const ScreeningQuestions = () => {
    const { data: questionsData, isLoading: isQuestionsLoading, isError } = useGetJobQuestionsQuery();
    const [createJobQuestion, { isLoading: isCreating }] = useCreateJobQuestionMutation();
    const [updateJobQuestion, { isLoading: isUpdating }] = useUpdateJobQuestionMutation();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newIsRequired, setNewIsRequired] = useState(false);

    // Edit state
    const [editingQuestion, setEditingQuestion] = useState(null); // holds the full question object
    const [editQuestion, setEditQuestion] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editIsRequired, setEditIsRequired] = useState(false);

    // Map API data to Select options
    const rawQuestions = questionsData?.data?.content || questionsData?.data || questionsData || [];
    const questionsList = Array.isArray(rawQuestions) ? rawQuestions : [];
    const questionOptions = questionsList.map(q => ({
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

    const handleStartEdit = (q) => {
        setEditingQuestion(q);
        setEditQuestion(q.question || '');
        setEditDescription(q.description || '');
        setEditIsRequired(q.isRequired ?? false);
    };

    const handleCancelEdit = () => {
        setEditingQuestion(null);
        setEditQuestion('');
        setEditDescription('');
        setEditIsRequired(false);
    };

    const handleUpdateQuestion = async () => {
        if (!editQuestion.trim()) {
            message.warning('Please enter a question');
            return;
        }
        try {
            await updateJobQuestion({
                id: editingQuestion.id,
                body: {
                    question: editQuestion.trim(),
                    isRequired: editIsRequired,
                    description: editDescription.trim() || undefined,
                },
            }).unwrap();
            message.success('Question updated successfully!');
            handleCancelEdit();
        } catch (error) {
            message.error(error?.data?.message || 'Failed to update question');
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

            {/* Questions list with edit */}
            {questionsList.length > 0 && (
                <div className="space-y-2 mt-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Questions</p>
                    {questionsList.map(q => (
                        <div key={q.id}>
                            {editingQuestion?.id === q.id ? (
                                /* ── Edit Form ── */
                                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Edit Question</h4>
                                        <button type="button" onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                            <span className="material-icons-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Question <span className="text-red-500">*</span>
                                        </label>
                                        <Input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <Input.TextArea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Switch size="small" checked={editIsRequired} onChange={setEditIsRequired} />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Required question</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button mode="default" size="sm" shape="round" onClick={handleCancelEdit}>Cancel</Button>
                                            <Button mode="primary" size="sm" shape="round" loading={isUpdating} onClick={handleUpdateQuestion}>Save</Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* ── Question Row ── */
                                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                    <div className="flex-1 min-w-0 mr-3">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{q.question}</p>
                                        {q.description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{q.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {q.isRequired && (
                                            <span className="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">Required</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(q)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-all"
                                            title="Edit question"
                                        >
                                            <span className="material-icons-outlined text-base">edit</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

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
