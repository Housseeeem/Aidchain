"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRequest } from "@/contexts/request-context";

export function DemoAuthButton() {
  const { login, logout, isAuthenticated, user } = useAuth();
  const { helloWorld, isUsingRealApi } = useRequest();
  const [helloMessage, setHelloMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    const demoUser = {
      email: "demo@aidchain.com",
      username: "Demo User",
      avatar_img: "https://api.dicebear.com/7.x/initials/svg?seed=Demo User",
    };
    login(demoUser);
  };

  const handleHelloWorld = async () => {
    setIsLoading(true);
    try {
      const response = await helloWorld();
      setHelloMessage(response.message);
    } catch (error) {
      setHelloMessage("Error: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 text-center bg-muted/30">
      <div className="container mx-auto px-4 space-y-6">
        <div>
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
            <Button onClick={handleDemoLogin}>Demo Login</Button>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">API Test</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Using: {isUsingRealApi ? "Real API" : "Mock API"}
            </p>
            <Button onClick={handleHelloWorld} disabled={isLoading}>
              {isLoading ? "Loading..." : "Test Hello World"}
            </Button>
            {helloMessage && (
              <p className="text-sm bg-muted p-2 rounded">
                {helloMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
