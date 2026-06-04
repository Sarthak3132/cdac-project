import React, { useState } from "react"
import { Link } from "react-router-dom"
import AuthWrapper from "../../features/auth/components/auth-wrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    setIsLoading(true)
    setTimeout(() =>{
      setSubmitted(true)
    }, 1500)

    setIsLoading(false)

    // dummy success — no real API yet
    
  }

  if (submitted) {
    return (
      <AuthWrapper title="Check your email" subtitle={`We sent a reset link to ${email}`}>
        <p className="text-sm text-center text-gray-500">
          Didn't get it?{" "}
          <button
            onClick={() => setSubmitted(false)}
            className="text-blue-600 hover:underline"
          >
            Try again
          </button>
        </p>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper title="Forgot password?" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError("") }}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending reset link..." : "Send reset link"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

      </form>
    </AuthWrapper>
  )
}