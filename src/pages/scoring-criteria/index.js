import React, { useEffect, useState } from 'react';
import { Modal, Form, Input as AntInput, InputNumber, message, ConfigProvider, Tabs } from 'antd';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';
import {
  useGetCriteriaPaginatedQuery,
  useCreateCriteriaMutation,
  useUpdateCriteriaMutation,
  useDeleteCriteriaMutation,
} from '@/apis/jobApi';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'true', label: 'Active' },
  { key: 'false', label: 'Inactive' },
];

const ScoringCriteria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm, pageSize, statusFilter]);

  const queryParams = {
    ...(debouncedSearchTerm && { name: debouncedSearchTerm }),
    active: statusFilter,
    page,
    size: pageSize,
  };

  const { data: criteriaData, isLoading, isFetching } = useGetCriteriaPaginatedQuery(queryParams);
  const [createCriteria, { isLoading: isCreating }] = useCreateCriteriaMutation();
  const [updateCriteria, { isLoading: isUpdating }] = useUpdateCriteriaMutation();
  const [deleteCriteria] = useDeleteCriteriaMutation();

  const criteriaList = criteriaData?.data?.content || [];
  const totalPages = criteriaData?.data?.totalPages || 0;

  const handleOpenCreate = () => {
    setEditingCriteria(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (criteria) => {
    setEditingCriteria(criteria);
    form.setFieldsValue({
      name: criteria.name,
      rule: criteria.rule,
      weight: criteria.weight,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (criteria) => {
    Modal.confirm({
      title: 'Delete Criteria',
      content: `Are you sure you want to delete "${criteria.name}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCriteria(criteria.id).unwrap();
          message.success('Criteria deleted successfully');
        } catch {
          message.error('Failed to delete criteria');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const body = {
        name: values.name,
        rule: values.rule || '',
        weight: values.weight,
      };

      if (editingCriteria) {
        await updateCriteria({ id: editingCriteria.id, body }).unwrap();
        message.success('Criteria updated successfully');
      } else {
        await createCriteria(body).unwrap();
        message.success('Criteria created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCriteria(null);
    } catch (error) {
      if (error?.errorFields) return;
      message.error('Failed to save criteria');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-3 md:items-center">
        <div className="w-full md:flex-1">
          <Input
            placeholder="Search by criteria name"
            prefix={<span className="material-icons-round text-gray-400 text-xl">search</span>}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>
        <Button
          mode="primary"
          shape="round"
          onClick={handleOpenCreate}
          iconLeft={<span className="material-icons-round">add</span>}
          className="shrink-0"
        >
          Add New Rule
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f97316',
            colorBorderHover: '#f97316',
          },
          components: {
            Tabs: {
              inkBarColor: '#f97316',
              itemSelectedColor: '#f97316',
              itemHoverColor: '#f97316',
            },
          },
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 pt-1">
            <Tabs
              activeKey={statusFilter}
              onChange={(key) => setStatusFilter(key)}
              items={STATUS_TABS}
            />
          </div>
        </div>
      </ConfigProvider>

      {/* Content */}
      {isLoading || isFetching ? (
        <div className="py-16">
          <Loading />
        </div>
      ) : criteriaList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-round text-gray-400 text-3xl">psychology</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No scoring criteria found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
            {debouncedSearchTerm
              ? 'Try adjusting your search.'
              : 'Create your first AI scoring rule to get started.'}
          </p>
          {!debouncedSearchTerm && (
            <Button mode="primary" onClick={handleOpenCreate}>
              Add New Rule
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {criteriaList.map((criteria) => (
              <div
                key={criteria.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {criteria.name}
                      </h3>
                      {criteria.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          Default
                        </span>
                      )}
                      {criteria.active === false ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Inactive
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span className="material-icons-outlined text-base">tune</span>
                      <span>Default Weight: {criteria.weight != null ? `${Math.round(criteria.weight)}%` : 'N/A'}</span>
                    </div>
                    {criteria.rule && (
                      <div className="flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <span className="material-icons-outlined text-base mt-0.5">description</span>
                        <span className="line-clamp-2">{criteria.rule}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      mode="secondary"
                      btnIcon
                      shape="round"
                      onClick={() => handleOpenEdit(criteria)}
                      tooltip="Edit"
                    >
                      <span className="material-icons-outlined text-lg">edit</span>
                    </Button>
                    {!criteria.isDefault && (
                      <Button
                        mode="secondary"
                        btnIcon
                        shape="round"
                        onClick={() => handleDelete(criteria)}
                        tooltip="Delete"
                      >
                        <span className="material-icons-outlined text-lg text-red-500">delete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Create/Edit Modal */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f97316',
          },
        }}
      >
        <Modal
          title={editingCriteria ? 'Edit Scoring Rule' : 'Create Scoring Rule'}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
            setEditingCriteria(null);
          }}
          onOk={handleSubmit}
          okText={editingCriteria ? 'Update' : 'Create'}
          confirmLoading={isCreating || isUpdating}
          destroyOnClose
          width={720}
        >
          <Form form={form} layout="vertical" className="mt-4">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter criteria name' }]}
            >
              <AntInput placeholder="e.g. Hard Skills, Experience, Cultural Fit" />
            </Form.Item>

            <Form.Item
              name="rule"
              label="Scoring Rule"
              extra="Describe how AI should evaluate this criteria"
            >
              <AntInput.TextArea
                rows={10}
                placeholder="e.g. Evaluate how well the candidate's technical skills match the job requirements"
              />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Default Weight (%)"
              rules={[
                { required: true, message: 'Please enter default weight' },
                { type: 'number', min: 1, max: 100, message: 'Weight must be between 1 and 100' },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                className="w-full"
                placeholder="e.g. 30"
                addonAfter="%"
              />
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default ScoringCriteria;
