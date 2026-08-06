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
import ResetPassword from "../pages/auth/reset-password";
import { CodeCompiler } from "../pages/app/code-compiler";
import PublicLayout from "@/components/layouts/public-layout";
import LandingPage from "@/pages/landing-page";
import PageNotFound from "@/pages/page-not-found";
import Dashboard from "@/pages/admin/dashboard";
import Problems from "@/pages/admin/problems";
import ProblemExamples from "@/pages/admin/problem-examples";
import Testcases from "@/pages/admin/testcases";
import Hints from "@/pages/admin/hints";
import Users from "@/pages/admin/users";
import Languages from "@/pages/admin/languages";
import Tags from "@/pages/admin/tags";
import ProblemCreate from "@/features/admin/components/problem/problem-create";
import ProblemUpdate from "@/features/admin/components/problem/problem-update";
import ProtectedRoutes from "@/routes/protected-routes";

export default function AppRoutes() {

  return (

    <Routes>
      {/* Public */}
      <Route element={<PublicRoutes />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* User */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<UserRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/app/compiler" element={<CodeCompiler />} />
            <Route path="/app/problems" element={<ProblemSet />} />
            <Route path="/app/problems/:id" element={<ProblemDetail />} />
            <Route path="/app/submission/:id" element={<ProblemSubmission />} />
            <Route path="/app/profile" element={<Profile />} />
          </Route>
        </Route>
        {/* Admin */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="languages" element={<Languages />} />
            <Route path="problems" element={<Problems />} />
            <Route path="problems/create" element={<ProblemCreate />} />
            <Route path="problems/update/:id" element={<ProblemUpdate />} />
            <Route path="tags" element={<Tags />} />
            <Route path="problem-examples" element={<ProblemExamples />} />
            <Route path="testcases" element={<Testcases />} />
            <Route path="hints" element={<Hints />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
