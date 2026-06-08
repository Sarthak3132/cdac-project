import { Route, Routes } from "react-router-dom";
import PublicRoutes from "../routes/public-routes";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgot-password";
import UserRoutes from "../routes/user-routes";
import AppLayout from "../components/layouts/app-layout";
import ProblemSet from "../pages/app/problem-set";
import ProblemDetail from "../pages/app/problem-detail";
import ProblemSubmission from "../pages/app/problem-submission";
import Profile from "../pages/app/profile";
import AdminRoutes from "../routes/admin-routes";
import AdminLayout from "../components/layouts/admin-layout";
import AdminDashboard from "../pages/admin/admin-dashboard";
import ResetPassword from "../pages/auth/reset-password";
import { CodeCompiler } from "../pages/app/code-compiler";
import PublicLayout from "@/components/layouts/public-layout";
import LandingPage from "@/pages/landing-page";
import PageNotFound from "@/pages/page-not-found";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicRoutes />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
           <Route path="*" element={<PageNotFound/>} />

        </Route>
      </Route>

      {/* User */}
      <Route element={<UserRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/app/compiler" element={<CodeCompiler />} />
          <Route path="/app/problems" element={<ProblemSet />} />
          <Route path="/app/problems/:id" element={<ProblemDetail />} />
          <Route path="/app/submissions" element={<ProblemSubmission />} />
          <Route path="/app/profile" element={<Profile />} />
           <Route path="*" element={<PageNotFound/>} />

        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminRoutes />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
           <Route path="*" element={<PageNotFound/>} />
          {/* <Route path="/admin/problems" element={<ManageProblemsPage />} /> */}
          {/* <Route path="/admin/users" element={<ManageUsersPage />} /> */}
        </Route>
      </Route>

    </Routes>
  );
}
