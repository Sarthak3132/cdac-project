import { useEffect } from "react"
import { useDispatch } from "react-redux"
import AppRoutes from "./app/router"
import { TooltipProvider } from "./components/ui/tooltip"
import { login } from "@/features/auth/slice/authSlice"
import { authService } from "@/features/auth/services/auth-service"
import type { AppDispatch } from "@/app/store"

export default function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // On app load, try to restore user session from JWT cookie
    const restoreSession = async () => {
      try {
        const user = await authService.getMe()
        dispatch(login(user))
      } catch (err) {
        // User not logged in or token expired — silently fail
        // User stays logged out, can go to /login
      }
    }

    restoreSession()
  }, [dispatch])

  return (
    <div>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
  )
}