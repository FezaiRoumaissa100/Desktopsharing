import { Globe, Lock, Zap, Users } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="text-green-600 dark:text-green-400">Key Features</span>
            </h2>
            <p className="max-w-[700px] text-green-800 dark:text-green-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Enjoy secure, browser-based remote access with full control or view-only modes. Simple, direct, and safe connections from any device.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 dark:border-green-800 p-6 shadow-sm bg-white dark:bg-green-950">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">100% Browser-Based</h3>
            <p className="text-center text-green-800 dark:text-green-200">
              Works directly in your browser—no downloads or installations required.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 dark:border-green-800 p-6 shadow-sm bg-white dark:bg-green-950">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">End-to-End Encryption</h3>
            <p className="text-center text-green-800 dark:text-green-200">
              Your connection is fully encrypted and secure from end to end.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 dark:border-green-800 p-6 shadow-sm bg-white dark:bg-green-950">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Cross-Platform</h3>
            <p className="text-center text-green-800 dark:text-green-200">Works on any device with a modern web browser.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 dark:border-green-800 p-6 shadow-sm bg-white dark:bg-green-950">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Completely Free</h3>
            <p className="text-center text-green-800 dark:text-green-200">All features available at no cost.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
