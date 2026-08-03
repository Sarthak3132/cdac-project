import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import AppRoutes from "./app/router"
import { TooltipProvider } from "./components/ui/tooltip"
import { login } from "@/features/auth/slice/authSlice"
import type { AppDispatch } from "@/app/store"
import { api } from "./services/axios-interceptor"

export default function App() {
<<<<<<< HEAD
  const dispatch = useDispatch<AppDispatch>()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get("/auth/me")
        const user = response.data.data
        dispatch(login(user))
      } catch (err) {
        // User not logged in
      } finally {
        setIsInitialized(true)
      }
    }

    restoreSession()
  }, [dispatch])

  // Don't render routes until session is restored
  if (!isInitialized) {
    return <div>Loading...</div>
  }
=======
>>>>>>> 76220237217f2bfb86fe03cee68ddcbcf30adec6

  return (
    <div>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
<<<<<<< HEAD
  )
}
=======
  );
}
>>>>>>> 76220237217f2bfb86fe03cee68ddcbcf30adec6
