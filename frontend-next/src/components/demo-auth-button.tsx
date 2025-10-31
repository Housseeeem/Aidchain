"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function DemoAuthButton() {
  const { login, logout, isAuthenticated, user } = useAuth()

  const handleDemoLogin = () => {
    const demoUser = {
      email: "demo@aidchain.com",
      username: "Demo User",
      avatar_img: "https://api.dicebear.com/7.x/initials/svg?seed=Demo User"
    }
    login(demoUser)
  }

  return (
    <div className="py-8 text-center bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold mb-4">Demo Authentication</h3>
        {isAuthenticated && user ? (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Logged in as: <strong>{user.username}</strong> ({user.email})
            </p>
            <Button onClick={logout} variant="outline">
              Demo Logout
            </Button>
          </div>
        ) : (
          <Button onClick={handleDemoLogin}>
            Demo Login
          </Button>
        )}
      </div>
    </div>
  )
}