import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import CompanyProfile from '@/pages/company';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import RecruiterRegister from '@/pages/register';
import PendingApproval from '@/pages/register/approval';
import JobsList from '@/pages/jobs';
import JobCreate from '@/pages/jobs/job-create';
import JobDetail from '@/pages/job-detail';
import Login from '@/pages/login';
import ApplicationManagement from "@/pages/application";
import BillingPlans from '@/pages/billing-plans';
import Checkout from '@/pages/checkout';
import ApplicationDetail from "@/pages/application/detail";
import Usage from "@/pages/usage";


export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Layout />}>
                {/* <Route index element={<Dashboard />} /> */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="recruiters" element={<Dashboard />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="jobs/create" element={<JobCreate />} />
                <Route path="jobs/:id/edit" element={<JobCreate />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="company" element={<CompanyProfile />} />
                <Route path="applications" element={<ApplicationManagement />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
                <Route path="reports" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="help" element={<Dashboard />} />
                <Route path="billing-plans" element={<BillingPlans />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="usage" element={<Usage />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="ui-kit" element={<UiKit />} />
            <Route path="register/recruiter" element={<RecruiterRegister />} />
            <Route path="register/pending-approval" element={<PendingApproval />} />
            <Route path="login" element={<Login />} />
        </Route>
    )
);
