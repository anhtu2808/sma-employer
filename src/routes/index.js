import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/Home';
import RecruiterRegister from '@/pages/register/RecruiterRegister';
import PendingApproval from '@/pages/register/PendingApproval';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Layout />}>
                {/* <Route index element={<Dashboard />} /> */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="recruiters" element={<Dashboard />} />
                <Route path="jobs" element={<Dashboard />} />
                <Route path="candidates" element={<Dashboard />} />
                <Route path="reports" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="help" element={<Dashboard />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="ui-kit" element={<UiKit />} />
            <Route path="register/recruiter" element={<RecruiterRegister />} />
            <Route path="register/pending-approval" element={<PendingApproval />} />
        </Route>
    )
);
