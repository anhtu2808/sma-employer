import React, { useMemo } from 'react';
import { Form, Select, Input, Button, AutoComplete } from 'antd';
import {
  DollarSign, ShieldCheck, CalendarOff, Clock, GraduationCap,
  Coffee, Monitor, Building2, Trees, Gift,
} from 'lucide-react';
import { useGetBenefitQuery } from '@/apis/masterDataApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '../../../../utils/icons';

const BENEFIT_TYPE_ICONS = {
  FINANCIAL: DollarSign,
  INSURANCE: ShieldCheck,
  TIME_OFF: CalendarOff,
  FLEXIBILITY: Clock,
  DEVELOPMENT: GraduationCap,
  LEISURE: Coffee,
  EQUIPMENT: Monitor,
  AMENITIES: Building2,
  WORK_ENVIRONMENT: Trees,
  OTHER: Gift,
};

const BENEFIT_TYPES = [
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'TIME_OFF', label: 'Time Off' },
  { value: 'FLEXIBILITY', label: 'Flexibility' },
  { value: 'DEVELOPMENT', label: 'Development' },
  { value: 'LEISURE', label: 'Leisure' },
  { value: 'EQUIPMENT', label: 'Equipment' },
  { value: 'AMENITIES', label: 'Amenities' },
  { value: 'WORK_ENVIRONMENT', label: 'Work Environment' },
  { value: 'OTHER', label: 'Other' },
];

const BenefitRow = ({ name, restField, allBenefits, onRemove }) => {
  const selectedType = Form.useWatch(['benefits', name, 'type']);

  const options = useMemo(() => {
    if (!selectedType || !allBenefits?.length) return [];
    return allBenefits
      .filter((b) => b.type === selectedType)
      .map((b) => ({
        value: b.description,
        label: (
          <div className="py-1">
            <div className="font-medium text-sm">{b.name}</div>
            <div className="text-xs text-gray-500 line-clamp-2">{b.description}</div>
          </div>
        ),
      }));
  }, [selectedType, allBenefits]);

  return (
    <div className="flex items-start gap-2 mb-6">
      <Form.Item
        {...restField}
        name={[name, 'type']}
        className="mb-0"
        style={{ width: 180, flexShrink: 0 }}
      >
        <Select
          options={BENEFIT_TYPES}
          placeholder="Type"
          optionRender={(option) => {
            const Icon = BENEFIT_TYPE_ICONS[option.value];
            return (
              <span className="flex items-center gap-2">
                {Icon && <Icon size={16} />}
                {option.label}
              </span>
            );
          }}
          labelRender={({ value, label }) => {
            const Icon = BENEFIT_TYPE_ICONS[value];
            return (
              <span className="flex items-center gap-2">
                {Icon && <Icon size={14} />}
                {label}
              </span>
            );
          }}
        />
      </Form.Item>
      <Form.Item
        {...restField}
        name={[name, 'description']}
        className="mb-0 flex-1 [&_.ant-input-data-count]:text-xs"
      >
        <AutoComplete
          options={options}
          filterOption={(input, option) =>
            option.value.toLowerCase().includes(input.toLowerCase())
          }
        >
          <Input.TextArea
            placeholder="Describe the benefit..."
            maxLength={250}
            showCount={{
              formatter: ({ count, maxLength }) => `${count}/${maxLength} chars`,
            }}
            autoSize={{ minRows: 2, maxRows: 4 }}
            className="!pb-5"
          />
        </AutoComplete>
      </Form.Item>
      <Button
        type="text"
        danger
        onClick={onRemove}
        className="mt-0.5 flex-shrink-0"
        icon={<FontAwesomeIcon icon={faTrash} className="text-lg" />}
      />
    </div>
  );
};

const BenefitsManager = () => {
  const { data: allBenefits } = useGetBenefitQuery({ size: 200 });

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Benefits from the company
      </label>
      <Form.List name="benefits">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <BenefitRow
                key={key}
                name={name}
                restField={restField}
                allBenefits={allBenefits}
                onRemove={() => remove(name)}
              />
            ))}
            <Button
              type="dashed"
              onClick={() => add({ type: 'OTHER', description: '' })}
              block
              icon={<FontAwesomeIcon icon={faPlus} className="text-sm" />}
            >
              Add benefit
            </Button>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default BenefitsManager;
