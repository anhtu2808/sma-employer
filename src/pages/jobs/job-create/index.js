import React, { useState, useEffect } from "react";
import { message } from "antd";
import Form from "@/components/Form";
import Button from "@/components/Button";
import {
  useCreateJobMutation,
  usePublishJobMutation,
  useSaveJobDraftMutation,
  useGetJobDetailQuery,
  useGetCriteriaQuery,
} from "@/apis/jobApi";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

// Components
import JobIdentity from "./components/JobIdentity";
import JobLocations from "./components/JobLocations";
import WorkCompensation from "./components/WorkCompensation";
import JobDescriptionSection from "./components/JobDescriptionSection";
import PublishCard from "./components/PublishCard";
import ScoringWeights from "./components/ScoringWeights";
import ProTips from "./components/ProTips";
import JobSettings from "./components/JobSettings";
import Classification from "./components/Classification";
import ScreeningQuestions from "./components/ScreeningQuestions";

const JobCreate = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitAction, setSubmitAction] = useState("publish");

  const [createJob, { isLoading: isDrafting }] = useCreateJobMutation();
  const [publishJob, { isLoading: isPublishing }] = usePublishJobMutation();
  const [saveJobDraft, { isLoading: isSaving }] = useSaveJobDraftMutation();
  const { data: criteriaRes } = useGetCriteriaQuery();

  // Fetch existing job data when in edit mode
  const { data: jobData, isLoading: isJobLoading } = useGetJobDetailQuery(id, {
    skip: !isEditMode,
  });

  // Pre-fill form when job data is loaded
  useEffect(() => {
    if (isEditMode && jobData?.data) {
      const job = jobData.data;
      form.setFieldsValue({
        name: job.name,
        about: job.about,
        responsibilities: job.responsibilities,
        requirement: job.requirement,
        enableAiScoring: job.enableAiScoring || false,
        expDate: job.expDate ? dayjs(job.expDate) : null,
        salaryStart: job.salaryStart,
        salaryEnd: job.salaryEnd,
        currency: job.currency || "VND",
        experienceTime: job.experienceTime,
        jobLevel: job.jobLevel,
        workingModel: job.workingModel,
        quantity: job.quantity,
        autoRejectThreshold: job.autoRejectThreshold,
        expertiseId: job.expertise?.id,
        skillIds: job.skills?.map((s) => s.id) || [],
        domainIds: job.domains?.map((d) => d.id) || [],
        benefitIds: job.benefits?.map((b) => b.id) || [],
        questionIds: job.questions?.map((q) => q.id) || [],
        locationIds: job.locationIds || [],
      });

      // Set scoring criteria weights
      if (job.scoringCriterias) {
        job.scoringCriterias.forEach((sc) => {
          form.setFieldValue(`weight_${sc.criteriaId}`, sc.weight);
        });
      }
    }
  }, [isEditMode, jobData, form]);

  const onFinish = async (values) => {
    try {
      console.log("Submit action:", submitAction);
      const criteriaList = criteriaRes?.data || [];
      const scoringCriterias = criteriaList.map((item) => ({
        criteriaId: item.id,
        weight:
          values[`weight_${item.id}`] !== undefined
            ? values[`weight_${item.id}`]
            : item.defaultWeight,
        enable: values.enableAiScoring,
      }));

      const totalWeight = scoringCriterias.reduce(
        (sum, item) => sum + item.weight,
        0,
      );
      if (values.enableAiScoring && totalWeight !== 100) {
        message.error(
          `Total scoring weight must be 100%. Current: ${totalWeight}%`,
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
        benefitIds: values.benefitIds || [],
        questionIds: values.questionIds || [],
        locationIds: values.locationIds || [],
        salaryStart: Number(values.salaryStart) || 0,
        salaryEnd: Number(values.salaryEnd) || 0,
        experienceTime: Number(values.experienceTime) || 0,
        quantity: Number(values.quantity) || 1,
        autoRejectThreshold: Number(values.autoRejectThreshold) || 0,
        expertiseId: values.expertiseId || 0,
        rootId: null,
      };

      // Remove temporary fields
      criteriaList.forEach((item) => {
        delete submitData[`weight_${item.id}`];
      });
      delete submitData.employmentType;

      if (isEditMode) {
        // Edit mode: use saveJobDraft
        await saveJobDraft({ id, body: submitData }).unwrap();

        if (submitAction === "publish") {
          await publishJob({ id, body: submitData }).unwrap();
          message.success("Job updated and published successfully!");
        } else {
          message.success("Job updated successfully!");
        }
      } else {
        // Create mode
        const res = await createJob(submitData).unwrap();
        const jobId = res?.data?.id || res?.id;

        if (submitAction === "publish") {
          if (jobId) {
            await publishJob({ id: jobId, body: submitData }).unwrap();
          }
          message.success("Job published successfully!");
        } else {
          message.success("Job draft saved successfully!");
        }
      }

      navigate("/jobs");
    } catch (error) {
      console.error("Failed to save job:", error);
      message.error("Failed to save job. Please try again.");
    }
  };

  if (isEditMode && isJobLoading) {
    return <div className="p-6">Loading job data...</div>;
  }

  return (
    <div className="p-6 max-w-[95%] mx-auto pb-20">
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

      <Form form={form} onFinish={onFinish} layout="vertical" className="block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <JobIdentity />
            <JobDescriptionSection />
            <WorkCompensation />
            <Classification />
            <JobLocations />
            <ScreeningQuestions />

            {/* Additional Settings (Optional but important) */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Additional Settings
              </h3>
              <JobSettings />
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <PublishCard
                onCancel={() => navigate(isEditMode ? `/jobs/${id}` : "/jobs")}
                isLoading={
                  isPublishing || (submitAction === "publish" && (isDrafting || isSaving))
                }
                isDraftLoading={submitAction === "draft" && (isDrafting || isSaving)}
                setAction={setSubmitAction}
                isEditMode={isEditMode}
              />
              <ScoringWeights />
              <ProTips />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default JobCreate;
