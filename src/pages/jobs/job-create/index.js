import React, { useState, useEffect, useMemo } from "react";
import { message, Switch, Tooltip } from "antd";
import Form from "@/components/Form";
import Button from "@/components/Button";
import { Info } from "lucide-react";
import Loading from "@/components/Loading";
import {
  useCreatePublishJobMutation,
  useCreateSaveJobDraftMutation,
  usePublishJobMutation,
  useSaveJobDraftMutation,
  useGetJobDetailQuery,
  useGetCriteriaQuery,
} from "@/apis/jobApi";
import { useGetFeatureUsageQuery } from "@/apis/featureUsageApi";
import { useGetSkillsQuery } from "@/apis/skillApi";
import { useGetExpertiseQuery, useGetDomainQuery } from "@/apis/masterDataApi";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";

// Components
import JobIdentity from "./components/JobIdentity";
import JobLocations from "./components/JobLocations";
import WorkCompensation from "./components/WorkCompensation";
import JobDescriptionSection from "./components/JobDescriptionSection";
import PublishConfirmModal from "./components/PublishConfirmModal";
import ImportJDModal from "./components/ImportJDModal";
import ScoringWeights from "./components/ScoringWeights";
import ProTips from "./components/ProTips";
import Classification from "./components/Classification";
import ScreeningQuestions from "./components/ScreeningQuestions";
import Preloader from "@/components/Preloader";

const BENEFIT_TYPES = [
  "FINANCIAL", "INSURANCE", "TIME_OFF", "FLEXIBILITY",
  "DEVELOPMENT", "LEISURE", "EQUIPMENT", "AMENITIES",
  "WORK_ENVIRONMENT", "OTHER",
];

const JobCreate = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [submitAction, setSubmitAction] = useState("publish");

  const clonedJobId = location.state?.clonedJobId;
  const targetId = isEditMode ? id : clonedJobId;
  const { data: jobData, isLoading: isJobLoading } = useGetJobDetailQuery(targetId, { skip: !targetId });
  const clonedJob = jobData?.data;

  const [createPublishJob, { isLoading: isPublishingNew }] = useCreatePublishJobMutation();
  const [createSaveJobDraft, { isLoading: isSavingNew }] = useCreateSaveJobDraftMutation();
  const [publishJob, { isLoading: isPublishing }] = usePublishJobMutation();
  const [saveJobDraft, { isLoading: isSaving }] = useSaveJobDraftMutation();
  const { data: criteriaList = [] } = useGetCriteriaQuery();
  const { data: featureUsage = [] } = useGetFeatureUsageQuery();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  // Master data for AI JD import
  const { data: skills = [] } = useGetSkillsQuery({ size: 200 });
  const { data: expertises = [] } = useGetExpertiseQuery({ size: 200 });
  const { data: domains = [] } = useGetDomainQuery({ size: 200 });

  const masterData = useMemo(() => ({
    skills: skills.map((s) => ({ id: s.id, name: s.name })),
    expertises: expertises.map((e) => ({ id: e.id, name: e.name })),
    domains: domains.map((d) => ({ id: d.id, name: d.name })),
    benefitTypes: BENEFIT_TYPES,
  }), [skills, expertises, domains]);

  React.useEffect(() => {
    if (clonedJob) {
      const initialValues = {
        ...clonedJob,
        expDate: clonedJob.expDate ? dayjs(clonedJob.expDate) : undefined,
        skillIds: clonedJob.skills?.map(s => s.id) || clonedJob.skillIds,
        domainIds: clonedJob.domains?.map(d => d.id) || clonedJob.domainIds,
        benefits: clonedJob.benefits?.map(b => ({
          type: b.type || 'OTHER',
          description: b.description || b.name || '',
        })) || [],
        locationIds: clonedJob.locations?.map(l => l.id) || clonedJob.locationIds,
        questionIds: clonedJob.questions?.map(q => q.id) || clonedJob.questionIds,
        expertiseId: clonedJob.expertise?.id || clonedJob.expertiseId,
      };

      // Set all criteria to disabled first, then enable ones from the job
      criteriaList.forEach((c) => {
        initialValues[`enable_${c.id}`] = false;
      });
      if (clonedJob.scoringCriterias) {
        clonedJob.scoringCriterias.forEach((c) => {
          const criteriaId = c.criteria?.id || c.criteriaId;
          initialValues[`weight_${criteriaId}`] = c.weight;
          initialValues[`enable_${criteriaId}`] = true;
          initialValues[`rule_${criteriaId}`] = c.rule || "";
        });
      }
      form.setFieldsValue(initialValues);
    }
  }, [clonedJob, criteriaList, form]);

  const onFinish = async (values) => {
    try {
      console.log("Submit action:", submitAction);
      const scoringCriterias = criteriaList.map((item) => ({
        criteriaId: item.id,
        weight:
          form.getFieldValue(`weight_${item.id}`) ??
          (item.weight || item.defaultWeight || 0),
        enable: form.getFieldValue(`enable_${item.id}`) !== false,
        rule: form.getFieldValue(`rule_${item.id}`) || null,
      }));

      const totalWeight = scoringCriterias.reduce(
        (sum, item) => sum + (item.enable ? item.weight : 0),
        0,
      );
      if (submitAction === "publish" && values.enableAiScoring && totalWeight !== 100) {
        message.error(
          `Total scoring weight of enabled criteria must be 100%. Current: ${totalWeight}%`,
        );
        return;
      }

      const submitData = {
        ...values,
        expDate: values.expDate
          ? dayjs.isDayjs(values.expDate)
            ? values.expDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
            : values.expDate
          : null,
        scoringCriterias,
        skillIds: values.skillIds || [],
        domainIds: values.domainIds || [],
        benefits: (values.benefits || []).map(b => ({
          name: b.description?.trim() || '',
          type: b.type || 'OTHER',
          description: b.description?.trim() || '',
        })),
        questionIds: values.questionIds || [],
        locationIds: values.locationIds || [],
        salaryStart: values.salaryStart != null && values.salaryStart !== '' ? Number(values.salaryStart) : null,
        salaryEnd: values.salaryEnd != null && values.salaryEnd !== '' ? Number(values.salaryEnd) : null,
        experienceTime: values.experienceTime != null ? Number(values.experienceTime) : null,
        quantity: values.quantity != null ? Number(values.quantity) : null,
        autoRejectThreshold: values.autoRejectThreshold != null ? Number(values.autoRejectThreshold) : null,
        expertiseId: values.expertiseId || null,
        rootId: clonedJob ? clonedJob.id : null,
      };

      // Remove temporary fields
      criteriaList.forEach((item) => {
        delete submitData[`weight_${item.id}`];
        delete submitData[`enable_${item.id}`];
        delete submitData[`rule_${item.id}`];
      });
      if (values.showSalary === false) {
        submitData.salaryStart = null;
        submitData.salaryEnd = null;
      }
      delete submitData.showSalary;
      delete submitData.employmentType;
      
      if (submitAction === "publish") {
        submitData.highlightJob = values.highlightJob === true;
      } else {
        delete submitData.highlightJob;
      }

      if (submitAction === "publish") {
        setPendingValues({ submitData, formValues: values });
        setShowConfirmModal(true);
        return;
      }

      // Draft path — execute immediately
      if (isEditMode) {
        await saveJobDraft({ id, body: submitData }).unwrap();
        message.success("Job updated successfully!");
        navigate(`/jobs/${id}`);
      } else {
        const res = await createSaveJobDraft(submitData).unwrap();
        const jobId = res?.data?.id || res?.id;
        message.success("Job draft saved successfully!");
        navigate(jobId ? `/jobs/${jobId}` : "/jobs");
      }
    } catch (error) {
      console.error("Failed to save job:", error);
      const validationErrors = error?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        Object.values(validationErrors).forEach((msg) => message.error(msg));
      } else {
        message.error(error?.data?.message || "Failed to save job. Please try again.");
      }
    }
  };

  const handleConfirmPublish = async () => {
    if (!pendingValues) return;
    const { submitData } = pendingValues;
    try {
      if (isEditMode) {
        await publishJob({ id, body: submitData }).unwrap();
        message.success("Job updated and published successfully!");
        navigate(`/jobs/${id}`);
      } else {
        const res = await createPublishJob(submitData).unwrap();
        const jobId = res?.data?.id || res?.id;
        message.success("Job published successfully!");
        navigate(jobId ? `/jobs/${jobId}` : "/jobs");
      }
      setShowConfirmModal(false);
      setPendingValues(null);
    } catch (error) {
      console.error("Failed to publish job:", error);
      const validationErrors = error?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        Object.values(validationErrors).forEach((msg) => message.error(msg));
      } else {
        message.error(error?.data?.message || "Failed to publish job. Please try again.");
      }
    }
  };

  const handleCancelPublish = () => {
    setShowConfirmModal(false);
    setPendingValues(null);
  };

  const handleImported = (result) => {
    setShowImportModal(false);

    // Unwrap ApiResponse envelope
    const parsedData = result?.data || result;

    // Map parsed data to form fields
    const formValues = {
      name: parsedData.name,
      about: parsedData.about,
      responsibilities: parsedData.responsibilities,
      requirement: parsedData.requirement,
      jobLevel: parsedData.jobLevel,
      experienceTime: parsedData.experienceTime,
      salaryStart: parsedData.salaryStart,
      salaryEnd: parsedData.salaryEnd,
      workingModel: parsedData.workingModel,
      quantity: parsedData.quantity,
      expertiseId: parsedData.expertiseId,
      domainIds: parsedData.domainIds || [],
      skillIds: parsedData.skillIds || [],
      benefits: (parsedData.benefits || []).map((b) => ({
        type: b.type || "OTHER",
        description: b.description || "",
      })),
    };

    // Remove null/undefined values so form doesn't override with empty
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] === null || formValues[key] === undefined) {
        delete formValues[key];
      }
    });

    form.setFieldsValue(formValues);

  };

  if (isEditMode && isJobLoading) {
    return <Loading className="py-16" />;
  }

  const isLoadingPublish = submitAction === "publish" && (isEditMode ? isPublishing : isPublishingNew);
  const isLoadingDraft = submitAction === "draft" && (isEditMode ? isSaving : isSavingNew);
  const isSubmitting = isLoadingPublish || isLoadingDraft;

  return (
    <>
      <Preloader isLoading={isSubmitting} />
    <div className="space-y-4">
      <Form form={form} onFinish={onFinish} onFinishFailed={() => message.error("Please fill in all required fields before publishing.")} layout="vertical" className="block">
        {/* Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button
            mode="text"
            className="self-start text-gray-500 hover:text-primary pl-0 -ml-6"
            onClick={() => navigate(isEditMode ? `/jobs/${id}` : "/jobs")}
            iconLeft={
              <span className="material-icons-round text-lg">arrow_back</span>
            }
          >
            {isEditMode ? "Back to Job Detail" : "Back to Jobs"}
          </Button>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Highlight</span>
                <Tooltip title="Highlighting a job increases its visibility to candidates by displaying it at the top of search results with a special badge.">
                  <Info size={14} className="text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Form.Item name="highlightJob" valuePropName="checked" className="mb-0">
                <Switch size="small" />
              </Form.Item>
            </div>

            {!isEditMode && (
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="h-9 px-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-orange-50 flex items-center gap-1.5 transition-colors text-sm text-primary"
              >
                <span className="material-icons-round text-base">auto_awesome</span>
                AI Import
              </button>
            )}
            <Button
              mode="secondary"
              htmlType="submit"
              loading={isLoadingDraft}
              onClick={() => setSubmitAction("draft")}
            >
              Save as Draft
            </Button>
            <Button
              mode="primary"
              htmlType="submit"
              loading={isLoadingPublish}
              onClick={() => setSubmitAction("publish")}
            >
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <JobIdentity />
            <JobDescriptionSection />
            <WorkCompensation />
            <Classification />
            <JobLocations />
            <ScreeningQuestions />
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <ScoringWeights />
              <ProTips />
            </div>
          </div>
        </div>
      </Form>

      <PublishConfirmModal
        open={showConfirmModal}
        onConfirm={handleConfirmPublish}
        onCancel={handleCancelPublish}
        loading={isEditMode ? isPublishing : isPublishingNew}
        values={pendingValues?.formValues}
        featureUsage={featureUsage}
        isEditMode={isEditMode}
      />

      <ImportJDModal
        open={showImportModal}
        onCancel={() => setShowImportModal(false)}
        onImported={handleImported}
        masterData={masterData}
      />
    </div>
    </>
  );
};

export default JobCreate;
