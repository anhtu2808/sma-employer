import React, { useState } from "react";
import { Slider, Form, Switch, Tooltip, InputNumber, Modal, Input as AntInput, ConfigProvider } from "antd";
import toastMessage from "@/utils/toastMessage";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGetCriteriaQuery, useCreateCriteriaMutation } from "@/apis/jobApi";
import Loading from "@/components/Loading";
import { CRITERIA_COLORS } from "@/constants/scoringColors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sparkles } from 'lucide-react';
import { faCircleExclamation, faMagnifyingGlass, faPen, faPlus, faXmark } from '../../../../utils/icons';

const ActiveCriterionRow = ({ criteriaItem, index, isAiActive, getFieldValue, setFieldsValue, remainingWeight, onRemove, onEditRule }) => {
  const currentWeight = getFieldValue(`weight_${criteriaItem.id}`) || 0;
  const maxAllowed = Math.min(100, currentWeight + remainingWeight);
  const color = CRITERIA_COLORS[index % CRITERIA_COLORS.length];

  return (
    <div>
      <div className="flex justify-between mb-1 text-sm items-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{criteriaItem.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Form.Item name={`weight_${criteriaItem.id}`} initialValue={criteriaItem.weight || criteriaItem.defaultWeight || 0} noStyle>
            <InputNumber
              size="small"
              min={0}
              max={100}
              style={{ width: 64 }}
              disabled={!isAiActive}
              formatter={(v) => `${v}%`}
              parser={(v) => v.replace("%", "")}
              onChange={(val) => {
                if (val !== null && val > maxAllowed) {
                  setFieldsValue({ [`weight_${criteriaItem.id}`]: maxAllowed });
                }
              }}
            />
          </Form.Item>
          <button
            type="button"
            onClick={() => onRemove(criteriaItem.id)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove criteria"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
          </button>
        </div>
      </div>
      <Form.Item name={`weight_${criteriaItem.id}`} initialValue={criteriaItem.weight || criteriaItem.defaultWeight || 0} noStyle>
        <Slider
          trackStyle={{ backgroundColor: color }}
          handleStyle={{ borderColor: color, backgroundColor: color }}
          disabled={!isAiActive}
          max={100}
          onChange={(val) => {
            if (val > maxAllowed) {
              setFieldsValue({ [`weight_${criteriaItem.id}`]: maxAllowed });
            }
          }}
        />
      </Form.Item>
      <button
        type="button"
        onClick={() => onEditRule(criteriaItem)}
        className="flex items-center gap-1 text-xs text-gray-500 font-medium hover:text-orange-500 transition-colors -mt-1 mb-1"
      >
        <FontAwesomeIcon icon={faPen} className="text-[14px]" />
        Customize rule
      </button>
    </div>
  );
};

const AvailableCriterionRow = ({ criteriaItem, index, onAdd }) => {
  const color = CRITERIA_COLORS[index % CRITERIA_COLORS.length];
  return (
    <div className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{criteriaItem.name}</span>
      </div>
      <button
        type="button"
        onClick={() => onAdd(criteriaItem)}
        className="px-2 py-0.5 text-xs font-medium rounded border border-orange-300 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center gap-0.5"
      >
        <FontAwesomeIcon icon={faPlus} className="text-[14px]" />
        Add
      </button>
    </div>
  );
};

const ScoringWeights = () => {
  const { data: criteriaList = [], isLoading } = useGetCriteriaQuery();
  const [createCriteria, { isLoading: isCreating }] = useCreateCriteriaMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [ruleText, setRuleText] = useState("");
  const [modalForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateCriteria = async () => {
    try {
      const values = await modalForm.validateFields();
      await createCriteria({
        name: values.name,
        rule: values.rule || "",
        weight: values.weight,
      }).unwrap();
      toastMessage.success("Criteria created successfully");
      setIsModalOpen(false);
      modalForm.resetFields();
    } catch (error) {
      if (error?.errorFields) return;
      toastMessage.error("Failed to create criteria");
    }
  };

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => {
        if (prevValues.enableAiScoring !== currentValues.enableAiScoring) return true;
        for (const criteriaItem of criteriaList) {
          if (prevValues[`enable_${criteriaItem.id}`] !== currentValues[`enable_${criteriaItem.id}`]) return true;
          if (prevValues[`weight_${criteriaItem.id}`] !== currentValues[`weight_${criteriaItem.id}`]) return true;
        }
        if (prevValues.autoRejectThreshold !== currentValues.autoRejectThreshold) return true;
        if (prevValues.enableAutoReject !== currentValues.enableAutoReject) return true;
        return false;
      }}
    >
      {({ getFieldValue, setFieldsValue }) => {
        const isAiActive = getFieldValue("enableAiScoring") !== false;

        const updates = {};
        let needsUpdate = false;

        if (!isAiActive) {
          criteriaList.forEach((criteria) => {
            if (getFieldValue(`enable_${criteria.id}`) !== false) {
              updates[`enable_${criteria.id}`] = false;
              needsUpdate = true;
            }
          });
        } else {
          const allDisabled = criteriaList.every((c) => getFieldValue(`enable_${c.id}`) === false);
          if (allDisabled && criteriaList.length > 0) {
            criteriaList.forEach((criteria) => {
              updates[`enable_${criteria.id}`] = true;
              updates[`weight_${criteria.id}`] = criteria.weight || criteria.defaultWeight || 0;
              needsUpdate = true;
            });
          }
        }

        if (needsUpdate) {
          setTimeout(() => setFieldsValue(updates), 0);
        }

        let currentTotalWeight = 0;
        const chartData = [];
        const activeCriteriaAll = [];
        const availableCriteriaAll = [];

        if (isAiActive) {
          criteriaList.forEach((criteriaItem, index) => {
            const isEnabled = getFieldValue(`enable_${criteriaItem.id}`) !== false;
            const weight = getFieldValue(`weight_${criteriaItem.id}`) || 0;
            if (isEnabled) {
              activeCriteriaAll.push({ ...criteriaItem, _index: index });
              currentTotalWeight += weight;
              if (weight > 0) {
                chartData.push({
                  name: criteriaItem.name,
                  value: weight,
                  color: CRITERIA_COLORS[index % CRITERIA_COLORS.length],
                });
              }
            } else {
              availableCriteriaAll.push({ ...criteriaItem, _index: index });
            }
          });
        } else {
          criteriaList.forEach((criteriaItem, index) => {
            availableCriteriaAll.push({ ...criteriaItem, _index: index });
          });
        }

        if (currentTotalWeight < 100 && chartData.length > 0) {
          chartData.push({ name: "Remaining", value: 100 - currentTotalWeight, color: "#E5E7EB" });
        }

        const isOver100 = currentTotalWeight > 100;
        const isPerfect = currentTotalWeight === 100;
        const remainingWeight = Math.max(0, 100 - currentTotalWeight);

        const searchLower = searchTerm.toLowerCase();
        const activeCriteria = searchTerm
          ? activeCriteriaAll.filter((c) => c.name.toLowerCase().includes(searchLower))
          : activeCriteriaAll;
        const availableCriteria = searchTerm
          ? availableCriteriaAll.filter((c) => c.name.toLowerCase().includes(searchLower))
          : availableCriteriaAll;

        const handleEqual = () => {
          if (activeCriteriaAll.length === 0) return;
          const base = Math.floor(100 / activeCriteriaAll.length);
          const remainder = 100 - base * activeCriteriaAll.length;
          const newValues = {};
          activeCriteriaAll.forEach((c, i) => {
            newValues[`weight_${c.id}`] = base + (i < remainder ? 1 : 0);
          });
          setFieldsValue(newValues);
        };

        const handleResetDefaults = () => {
          const newValues = {};
          criteriaList.forEach((c) => {
            newValues[`weight_${c.id}`] = c.weight || c.defaultWeight || 0;
            newValues[`enable_${c.id}`] = true;
          });
          setFieldsValue(newValues);
        };

        const handleAdd = (criteriaItem) => {
          const defaultWeight = Math.min(criteriaItem.weight || criteriaItem.defaultWeight || 10, remainingWeight);
          setFieldsValue({
            [`enable_${criteriaItem.id}`]: true,
            [`weight_${criteriaItem.id}`]: defaultWeight,
          });
        };

        const handleRemove = (id) => {
          setFieldsValue({
            [`enable_${id}`]: false,
            [`weight_${id}`]: 0,
          });
        };

        const handleEditRule = (criteriaItem) => {
          const currentVal = getFieldValue(`rule_${criteriaItem.id}`);
          setRuleText(currentVal || criteriaItem.rule || "");
          setEditingRuleId(criteriaItem.id);
        };

        const ringClass = isOver100
          ? "ring-2 ring-red-300"
          : isPerfect
            ? "ring-2 ring-green-300"
            : "";

        return (
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 transition-all ${ringClass}`}>
            {/* Header */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 shadow-sm">
                    <Sparkles size={18} className="text-white" />
                  </span>
                  AI Scoring Weights
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white leading-none">Pro</span>
                </h3>
                <Form.Item name="enableAiScoring" valuePropName="checked" initialValue={true} noStyle>
                  <Switch
                    className={isAiActive ? "bg-orange-500" : "bg-gray-400"}
                  />
                </Form.Item>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure how AI evaluates candidates for this role
              </p>
            </div>

            <div className={`space-y-5 transition-all duration-300 ${!isAiActive ? "opacity-50 grayscale pointer-events-none" : ""}`}>
              {/* Sticky Donut Chart + Preset Buttons */}
              <div className="bg-white dark:bg-gray-800 pb-3">
                {!isLoading && chartData.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="relative" style={{ width: 160, height: 160 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={72}
                            dataKey="value"
                            strokeWidth={2}
                            stroke="#fff"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl font-bold ${isOver100 ? "text-red-500" : isPerfect ? "text-green-500" : "text-orange-500"}`}>
                          {currentTotalWeight}%
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium mt-1 ${isOver100 ? "text-red-500" : isPerfect ? "text-green-500" : "text-orange-500"}`}>
                      {isPerfect ? "Perfect!" : isOver100 ? `${currentTotalWeight - 100}% over` : `${remainingWeight}% remaining`}
                    </span>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
                      {chartData.filter((d) => d.name !== "Remaining").map((d, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: d.color }} />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preset Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleEqual}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Equal
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              {!isLoading && criteriaList.length > 0 && (
                <div>
                  <AntInput
                    placeholder="Search criteria..."
                    prefix={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-[18px]" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    size="middle"
                    className="!rounded-lg"
                  />
                </div>
              )}

              {/* Tabs */}
              {!isLoading && criteriaList.length > 0 && (
                <div>
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab("active")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "active"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Active ({activeCriteriaAll.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("available")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "available"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Available ({availableCriteriaAll.length})
                    </button>
                  </div>

                  {/* Scrollable Tab Content */}
                  <div className="max-h-[400px] overflow-y-auto mt-3 pr-1" style={{ scrollbarWidth: "thin" }}>
                    {activeTab === "active" ? (
                      activeCriteria.length > 0 ? (
                        <div className="space-y-4">
                          {activeCriteria.map((criteriaItem) => (
                            <ActiveCriterionRow
                              key={criteriaItem.id}
                              criteriaItem={criteriaItem}
                              index={criteriaItem._index}
                              isAiActive={isAiActive}
                              getFieldValue={getFieldValue}
                              setFieldsValue={setFieldsValue}
                              remainingWeight={remainingWeight}
                              onRemove={handleRemove}
                              onEditRule={handleEditRule}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-sm text-gray-400">
                          {searchTerm ? "No active criteria match your search" : "No active criteria. Add some from the Available tab."}
                        </div>
                      )
                    ) : (
                      availableCriteria.length > 0 ? (
                        <div className="space-y-1">
                          {availableCriteria.map((criteriaItem) => (
                            <AvailableCriterionRow
                              key={criteriaItem.id}
                              criteriaItem={criteriaItem}
                              index={criteriaItem._index}
                              onAdd={handleAdd}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-sm text-gray-400">
                          {searchTerm ? "No available criteria match your search" : "All criteria are active."}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-center p-4">
                  <Loading inline size={76} />
                </div>
              )}

              {/* Add Custom Criteria */}
              {!isLoading && (
                <button
                  type="button"
                  onClick={() => {
                    modalForm.resetFields();
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-1"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-base" />
                  Add Custom Criteria
                </button>
              )}

              {/* Auto-Reject Threshold */}
              {(() => {
                const autoRejectEnabled = getFieldValue("enableAutoReject") !== false && isAiActive;
                return (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Reject Threshold</label>
                        <Tooltip title="This is the percentage scale used to automatically reject CVs with matching scores lower than the set threshold.">
                          <FontAwesomeIcon icon={faCircleExclamation} className="text-[14px] text-gray-400 cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-2">
                        {autoRejectEnabled && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                            Below {getFieldValue("autoRejectThreshold") || 40}
                          </span>
                        )}
                        <Form.Item name="enableAutoReject" valuePropName="checked" initialValue={true} noStyle>
                          <Switch
                            size="small"
                            disabled={!isAiActive}
                            className={autoRejectEnabled ? "bg-orange-500" : "bg-gray-400"}
                            onChange={(checked) => {
                              if (!checked) {
                                setFieldsValue({ autoRejectThreshold: 0 });
                              } else {
                                setFieldsValue({ autoRejectThreshold: 40 });
                              }
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {autoRejectEnabled && (
                      <Form.Item name="autoRejectThreshold" noStyle initialValue={40}>
                        <Slider
                          trackStyle={{ backgroundColor: "#F97316" }}
                          handleStyle={{ borderColor: "#F97316", backgroundColor: "#F97316" }}
                        />
                      </Form.Item>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {autoRejectEnabled
                        ? "Candidates scoring below this will be automatically moved to 'Rejected'."
                        : isAiActive
                          ? "Auto-reject is disabled. Candidates will not be automatically rejected."
                          : "AI Scoring is disabled. Candidates will not be auto-rejected."}
                    </p>
                  </div>
                );
              })()}

              {/* Sync: when AI is turned off, disable auto-reject and reset threshold */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.enableAiScoring !== currentValues.enableAiScoring
                }
              >
                {({ getFieldValue: gfv, setFieldsValue: sfv }) => {
                  const aiActive = gfv("enableAiScoring") !== false;
                  if (!aiActive && gfv("enableAutoReject") !== false) {
                    setTimeout(() => sfv({ enableAutoReject: false, autoRejectThreshold: 0 }), 0);
                  }
                  return null;
                }}
              </Form.Item>
            </div>

            {/* Rule Editor Modal */}
            <ConfigProvider theme={{ token: { colorPrimary: "#f97316" } }}>
              <Modal
                title={criteriaList.find((c) => c.id === editingRuleId)?.name || "Customize Rule"}
                open={editingRuleId !== null}
                onCancel={() => setEditingRuleId(null)}
                onOk={() => {
                  setFieldsValue({ [`rule_${editingRuleId}`]: ruleText });
                  setEditingRuleId(null);
                }}
                okText="Save"
                destroyOnClose
                width={720}
              >
                <AntInput.TextArea
                  rows={12}
                  value={ruleText}
                  onChange={(e) => setRuleText(e.target.value)}
                  placeholder="Describe how AI should evaluate this criteria..."
                  className="!text-sm mt-4"
                />
              </Modal>
            </ConfigProvider>

            {/* Create Criteria Modal */}
            <ConfigProvider theme={{ token: { colorPrimary: "#f97316" } }}>
              <Modal
                title="Create Custom Criteria"
                open={isModalOpen}
                onCancel={() => {
                  setIsModalOpen(false);
                  modalForm.resetFields();
                }}
                onOk={handleCreateCriteria}
                okText="Create"
                confirmLoading={isCreating}
                destroyOnClose
              >
                <Form form={modalForm} layout="vertical" className="mt-4">
                  <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter criteria name" }]}>
                    <AntInput placeholder="e.g. Leadership, Communication Skills" />
                  </Form.Item>
                  <Form.Item name="rule" label="Scoring Rule" extra="Describe how AI should evaluate this criteria">
                    <AntInput.TextArea rows={4} placeholder="e.g. Evaluate the candidate's leadership experience..." />
                  </Form.Item>
                  <Form.Item
                    name="weight"
                    label="Default Weight (%)"
                    rules={[
                      { required: true, message: "Please enter default weight" },
                      { type: "number", min: 1, max: 100, message: "Weight must be between 1 and 100" },
                    ]}
                  >
                    <InputNumber min={1} max={100} className="w-full" placeholder="e.g. 20" addonAfter="%" />
                  </Form.Item>
                </Form>
              </Modal>
            </ConfigProvider>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default ScoringWeights;
