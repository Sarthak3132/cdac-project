import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {type AuthLayoutProps} from "@/types/auth"


export default function AuthWrapper({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card className="border-border shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-muted-foreground">
                {subtitle}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}