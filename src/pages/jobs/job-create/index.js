import React, { useState } from "react";
import { message } from "antd";
import Form from "@/components/Form";
import Button from "@/components/Button";
import {
  useCreateJobMutation,
  usePublishJobMutation,
  useGetCriteriaQuery,
} from "@/apis/jobApi";
import { useNavigate } from "react-router-dom";

// Components
import JobIdentity from "./components/JobIdentity";
import JobLocations from "./components/JobLocations";
import WorkCompensation from "./components/WorkCompensation";
import JobDescriptionSection from "./components/JobDescriptionSection";
import PublishCard from "./components/PublishCard";
import ScoringWeights from "./components/ScoringWeights";
import ProTips from "./components/ProTips";
import JobSettings from "./components/JobSettings"; // Keep for extra settings if needed, or remove if unused.
// Actually, JobSettings had 'Application Deadline', 'Number of Openings', 'Auto-Reject'.
// These fit well in a 'Job Settings' section, maybe under Work & Comp or in the sidebar?
// The image doesn't explicitly show them. I will put them at the bottom of the main col for now.
import Classification from "./components/Classification";
import ScreeningQuestions from "./components/ScreeningQuestions";

const JobCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitAction, setSubmitAction] = useState("publish");

  const [createJob, { isLoading: isDrafting }] = useCreateJobMutation();
  const [publishJob, { isLoading: isPublishing }] = usePublishJobMutation();
  const { data: criteriaRes } = useGetCriteriaQuery();

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
        rootId: null, // Default as per requirement
      };

      // Remove temporary fields
      criteriaList.forEach((item) => {
        delete submitData[`weight_${item.id}`];
      });

      // 1. Always create draft first
      const res = await createJob(submitData).unwrap();
      const jobId = res?.data?.id || res?.id;

      // 2. Publish if requested
      if (submitAction === "publish") {
        if (jobId) {
          await publishJob({
            id: jobId,
            body: submitData,
          }).unwrap();
        }
        message.success("Job published successfully!");
      } else {
        message.success("Job draft saved successfully!");
      }

      navigate("/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);
      message.error("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-[95%] mx-auto pb-20">
      <Button
        mode="text"
        className="self-start text-gray-500 hover:text-primary pl-0 -ml-6"
        onClick={() => navigate("/jobs")}
        iconLeft={
          <span className="material-icons-round text-lg">arrow_back</span>
        }
      >
        Back to Jobs
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
                onCancel={() => navigate("/jobs")}
                isLoading={
                  isPublishing || (submitAction === "publish" && isDrafting)
                }
                isDraftLoading={submitAction === "draft" && isDrafting}
                setAction={setSubmitAction}
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
