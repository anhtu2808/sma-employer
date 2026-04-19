import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import Recruiters from '@/pages/recruiters';
import CompanyProfile from '@/pages/company';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import RecruiterRegister from '@/pages/register';
import PendingApproval from '@/pages/register/approval';
import JobsList from '@/pages/jobs';
import JobCreate from '@/pages/jobs/job-create';
import JobDetail from '@/pages/job-detail';
import ProposedCVDetail from '@/pages/proposed-cv-detail';
import Login from '@/pages/login';
import ApplicationManagement from "@/pages/application";
import BillingPlans from '@/pages/billing-plans';
import PaymentHistory from '@/pages/payment-history';
import Checkout from '@/pages/checkout';
import ApplicationDetail from "@/pages/application/detail";
import Usage from "@/pages/usage";
import NotificationList from "../pages/notification";
import CompanyBlacklist from "@/pages/blacklist";
import Settings from "@/pages/setting";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import InvitationList from "@/pages/invitations";
import InvitationDetail from "@/pages/invitations/detail";
import ScoringCriteria from "@/pages/scoring-criteria";
import CvPreview from "@/pages/cv-preview";
import CareerPageBuilder from "@/pages/career-builder";
import WebhookPage from "@/pages/webhook";
import LegalPage from '@/pages/legal';
import ApiManagementPage from '@/pages/api-management';
import TalentPool from '@/pages/talent-pool';
import TalentPoolCvDetail from '@/pages/talent-pool/cv-detail';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Layout />}>
                {/* <Route index element={<Dashboard />} /> */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="recruiters" element={<Recruiters />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="jobs/archived" element={<JobsList archivedOnly={true} />} />
                <Route path="jobs/create" element={<JobCreate />} />
                <Route path="jobs/:id/edit" element={<JobCreate />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="jobs/:jobId/proposed-cvs/:resumeId" element={<ProposedCVDetail />} />
                <Route path="company" element={<CompanyProfile />} />
                <Route path="applications" element={<ApplicationManagement />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
                <Route path="reports" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Dashboard />} />
                <Route path="billing-plans" element={<BillingPlans />} />
                <Route path="payment-history" element={<PaymentHistory />} />
                <Route path="usage" element={<Usage />} />
                <Route path="notifications" element={<NotificationList />} />
                <Route path="blacklist" element={<CompanyBlacklist />} />
                <Route path="invitations" element={<InvitationList />} />
                <Route path="invitations/:id" element={<InvitationDetail />} />
                <Route path="scoring-criteria" element={<ScoringCriteria />} />
                <Route path="webhooks" element={<WebhookPage />} />
                <Route path="api-management" element={<ApiManagementPage />} />
                <Route path="talent-pool" element={<TalentPool />} />
                <Route path="talent-pool/cv/:resumeId" element={<TalentPoolCvDetail />} />
            </Route>
            <Route path="cv-preview/:id" element={<CvPreview />} />
            <Route path="career-builder" element={<CareerPageBuilder />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="/" element={<Home />} />
            <Route path="ui-kit" element={<UiKit />} />
            <Route path="register/recruiter" element={<RecruiterRegister />} />
            <Route path="register/pending-approval" element={<PendingApproval />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="legal/:type" element={<LegalPage />} />
        </Route>
    )
);
