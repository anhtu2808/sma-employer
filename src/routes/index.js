import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import CompanyProfile from '@/pages/company';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import RecruiterRegister from '@/pages/register/RecruiterRegister';
import PendingApproval from '@/pages/register/PendingApproval';
import JobsList from '@/pages/jobs';
import JobDetail from '@/pages/job-detail';
import Login from '@/pages/login';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Layout />}>
                {/* <Route index element={<Dashboard />} /> */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="recruiters" element={<Dashboard />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="company" element={<CompanyProfile />} />
                <Route path="candidates" element={<Dashboard />} />
                <Route path="reports" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="help" element={<Dashboard />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="ui-kit" element={<UiKit />} />
            <Route path="register/recruiter" element={<RecruiterRegister />} />
            <Route path="register/pending-approval" element={<PendingApproval />} />
            <Route path="login" element={<Login />} />
        </Route>
    )
);
