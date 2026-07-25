import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/slice/authSlice";
import { authService } from "@/features/auth/services/auth-service";
import type { AppDispatch } from "@/app/store";
import AuthWrapper from "../../features/auth/components/auth-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call login endpoint
      await authService.login(email, password);
      
      // Get user data from /me endpoint
      const user = await authService.getMe();
      
      // Dispatch to Redux
      dispatch(login(user));
      
      // Redirect to app
      navigate("/app/compiler");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <AuthWrapper title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="test@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthWrapper>
  );
}