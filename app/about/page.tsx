"use client"
import { Footer } from "@/components/footer"
import { Users, Globe, Shield, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  About <span className="text-brand-600 dark:text-brand-400">VNCConnect</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Empowering secure remote connections worldwide since 2023
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
                <p className="text-muted-foreground">
                  At VNCConnect, we're on a mission to make remote access simple, secure, and accessible to everyone. 
                  We believe in breaking down the barriers of distance through technology, enabling seamless collaboration 
                  and support across the globe.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Our Vision</h2>
                <p className="text-muted-foreground">
                  We envision a world where distance is no longer a barrier to collaboration. Where helping someone with 
                  their computer is as simple as opening a web browser, and where security and simplicity go hand in hand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Our Core Values</h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                  <Shield className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">Security First</h3>
                <p className="text-muted-foreground">
                  We prioritize the security and privacy of our users above everything else.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                  <Users className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">User-Centric</h3>
                <p className="text-muted-foreground">
                  Every feature we build starts with our users' needs and experiences.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                  <Globe className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making remote access technology available to everyone, everywhere.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                  <Award className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-muted-foreground">
                  Continuously improving and pushing the boundaries of what's possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Our Team</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900" />
                <div>
                  <h3 className="text-xl font-bold">Rayene Knani</h3>
                  <p className="text-muted-foreground">CEO & Co-founder</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900" />
                <div>
                  <h3 className="text-xl font-bold">Fatma Trabelsi</h3>
                  <p className="text-muted-foreground">CTO & Co-founder</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900" />
                <div>
                  <h3 className="text-xl font-bold">Mohamed Amine Achour</h3>
                  <p className="text-muted-foreground">Head of Product</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900" />
                <div>
                  <h3 className="text-xl font-bold">Roumaissa Fezai</h3>
                  <p className="text-muted-foreground">Head of Design</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 