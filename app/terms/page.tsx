"use client"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Scale, AlertCircle, Clock } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Terms of <span className="text-brand-600 dark:text-brand-400">Service</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Last updated: March 15, 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            {/* Key Points */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <FileText className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">Terms Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Clear and transparent terms for using our service.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <Scale className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">User Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Understanding your rights and responsibilities.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <AlertCircle className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">Limitations</h3>
                    <p className="text-sm text-muted-foreground">
                      Service limitations and acceptable use policy.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <Clock className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">Duration</h3>
                    <p className="text-sm text-muted-foreground">
                      Terms duration and modification policies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Terms Sections */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold tracking-tighter mb-6">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-8">
                By accessing or using VNCConnect, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">2. Use License</h2>
              <p className="text-muted-foreground mb-8">
                VNCConnect grants you a limited, non-exclusive, non-transferable license to use the service for personal or business purposes, subject to these terms.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>You must not use the service for any illegal purposes</li>
                <li>You must not attempt to gain unauthorized access to any part of the service</li>
                <li>You must not interfere with or disrupt the service</li>
                <li>You must not share your account credentials</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">3. Service Limitations</h2>
              <p className="text-muted-foreground mb-8">
                VNCConnect reserves the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>Modify or discontinue any part of the service without notice</li>
                <li>Limit service availability based on geographic location</li>
                <li>Restrict access for violation of these terms</li>
                <li>Implement usage limits to ensure service quality</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">4. User Responsibilities</h2>
              <p className="text-muted-foreground mb-8">
                As a user of VNCConnect, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>Maintaining the security of your account</li>
                <li>Ensuring compliance with local laws and regulations</li>
                <li>Protecting sensitive information shared during sessions</li>
                <li>Reporting any security vulnerabilities or misuse</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">5. Disclaimer</h2>
              <p className="text-muted-foreground mb-8">
                The service is provided "as is" without warranties of any kind. VNCConnect is not responsible for any damages or losses resulting from the use of our service.
              </p>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">6. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@vncconnect.com
                <br />
                Address: 123 Tech Street, Suite 456, San Francisco, CA 94105
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 