import { Globe, Lock, Zap, Users } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-feature-gradient">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="text-brand-600 dark:text-brand-400">Key Features</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Enjoy secure, browser-based remote access with full control or view-only modes. Simple, direct, and safe connections from any device.
            </p>
          </div>
        </div>
        
        <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-brand-200 dark:border-brand-800 p-6 shadow-sm bg-white dark:bg-gray-900">
            <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
              <Zap className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">100% Browser-Based</h3>
            <p className="text-center text-muted-foreground">
              Works directly in your browser—no downloads or installations required.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-brand-200 dark:border-brand-800 p-6 shadow-sm bg-white dark:bg-gray-900">
            <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
              <Lock className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">End-to-End Encryption</h3>
            <p className="text-center text-muted-foreground">
              Your connection is fully encrypted and secure from end to end.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-brand-200 dark:border-brand-800 p-6 shadow-sm bg-white dark:bg-gray-900">
            <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
              <Globe className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Cross-Platform</h3>
            <p className="text-center text-muted-foreground">Works on any device with a modern web browser.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-brand-200 dark:border-brand-800 p-6 shadow-sm bg-white dark:bg-gray-900">
            <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900">
              <Users className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Completely Free</h3>
            <p className="text-center text-muted-foreground">All features available at no cost.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
