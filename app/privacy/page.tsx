"use client"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Database } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Privacy <span className="text-brand-600 dark:text-brand-400">Policy</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Last updated: March 15, 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            {/* Key Privacy Features */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <Shield className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">Data Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with industry-standard encryption and security measures.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <Lock className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">End-to-End Encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      All remote sessions are secured with end-to-end encryption.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <Eye className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">No Session Recording</h3>
                    <p className="text-sm text-muted-foreground">
                      We never record or store your remote sessions.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
                      <Database className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="font-semibold">Minimal Data Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      We only collect essential data needed for the service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Policy Sections */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold tracking-tighter mb-6">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-8">
                We collect minimal information necessary to provide our service. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>Email address (for account creation)</li>
                <li>Connection timestamps</li>
                <li>IP addresses (for security purposes)</li>
                <li>Browser and device information</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-8">
                Your information is used solely for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>Providing and maintaining the VNCConnect service</li>
                <li>Ensuring security of connections</li>
                <li>Improving our service</li>
                <li>Communicating service updates</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">3. Data Security</h2>
              <p className="text-muted-foreground mb-8">
                We implement robust security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>End-to-end encryption for all remote sessions</li>
                <li>Secure data transmission using SSL/TLS</li>
                <li>Regular security audits and updates</li>
                <li>Strict access controls and authentication</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">4. Your Rights</h2>
              <p className="text-muted-foreground mb-8">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-12">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
                <li>Request data portability</li>
              </ul>

              <h2 className="text-2xl font-bold tracking-tighter mb-6">5. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, please contact our Data Protection Officer at:
                <br />
                Email: privacy@vncconnect.com
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