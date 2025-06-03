import { Check } from "lucide-react"
import { Footer } from "@/components/footer"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="text-brand-600 dark:text-brand-400">Powerful Features</span> for Remote Access
                </h1>
                <p className="max-w-[700px] text-brand-800 dark:text-brand-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the essential features of VNCConnect: secure, browser-based remote access with full control or view-only modes. Simple, direct, and safe connections from any device.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-feature-gradient">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-4">
                <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
                  <Check className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">Browser-Based Access</h3>
                <p className="text-brand-800 dark:text-brand-200">
                  No downloads or installations required. Connect directly through your web browser.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
                  <Check className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">End-to-End Encryption</h3>
                <p className="text-brand-800 dark:text-brand-200">
                  All connections are secured with strong encryption to protect your data.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
                  <Check className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">Cross-Platform Support</h3>
                <p className="text-brand-800 dark:text-brand-200">
                  Works on Windows, Mac, Linux, and mobile devices with modern browsers.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
                  <Check className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">View-Only Mode</h3>
                <p className="text-brand-800 dark:text-brand-200">
                  Share your screen in view-only mode for presentations and demonstrations.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
                  <Check className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">Full Control Mode</h3>
                <p className="text-brand-800 dark:text-brand-200">
                  Grant full keyboard and mouse control for remote assistance.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-lg">
                  <Check className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">No Registration Required</h3>
                <p className="text-brand-800 dark:text-brand-200">
                  Start using VNCConnect immediately without creating an account.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
