import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthWrapper from "../../features/auth/components/auth-wrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading , setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setTimeout(() => navigate("/login"), 2000)
    }, 1500)
  }

  if (submitted) {
    return (
      <AuthWrapper title="Password reset!" subtitle="Redirecting you to login...">
        <p className="text-center text-sm text-gray-500">
          Your password has been changed successfully.
        </p>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper title="Set new password" subtitle="Choose a strong password">
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="space-y-1">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError("") }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError("") }}
          />
        </div>

        <Button type="submit" className="w-full" disabled = {isLoading}>
          {isLoading ? "Resetting password..." : "Reset Password"}
        </Button>

      </form>
    </AuthWrapper>
  )
}