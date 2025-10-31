"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { ArrowRight, Shield, Database, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" className="text-primary" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Secure Data
            <span className="text-primary block">Sharing & Monetization</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AidChain enables organizations to securely share anonymized datasets across any industry
            while maintaining privacy and creating value from data collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Browse Datasets
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                Advanced anonymization ensures patient privacy while maintaining data utility
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Data</h3>
              <p className="text-muted-foreground">
                Curated, high-quality datasets from trusted organizations across all industries
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Collaborative</h3>
              <p className="text-muted-foreground">
                Connect data providers and consumers across industries for breakthrough insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}