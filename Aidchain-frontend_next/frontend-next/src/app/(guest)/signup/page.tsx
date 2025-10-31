"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Building, Clock, Mail } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Registration Coming Soon
          </CardTitle>
          <CardDescription>
            We're preparing something amazing for you. Account registration will
            be available soon!
          </CardDescription>
          <Badge variant="secondary" className="mx-auto mt-2">
            Beta Launch
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-20 flex-col opacity-50 cursor-not-allowed"
                disabled
              >
                <User className="h-6 w-6 mb-2" />
                Researcher
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-20 flex-col opacity-50 cursor-not-allowed"
                disabled
              >
                <Building className="h-6 w-6 mb-2" />
                Data Provider
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              disabled
              className="opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              type="text"
              placeholder="Enter your organization"
              disabled
              className="opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              disabled
              className="opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                disabled
                className="opacity-50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 opacity-50 cursor-not-allowed"
                disabled
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              disabled
              className="opacity-50"
            />
          </div>

          <div className="flex items-center space-x-2 opacity-50">
            <input id="terms" type="checkbox" className="h-4 w-4" disabled />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Coming Soon Info */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 text-center">
            <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h4 className="font-semibold text-primary mb-1">Get Notified</h4>
            <p className="text-sm text-muted-foreground">
              Want to be the first to know when registration opens?
              <Link
                href="/contact"
                className="text-primary hover:underline ml-1"
              >
                Contact us
              </Link>{" "}
              to join our waitlist.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full opacity-50 cursor-not-allowed" disabled>
            Registration Not Available
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
