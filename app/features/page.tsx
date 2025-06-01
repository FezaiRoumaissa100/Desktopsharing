import { Check } from "lucide-react"
import { Footer } from "@/components/footer"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-950 dark:to-green-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="text-green-600 dark:text-green-400">Powerful Features</span> for Remote Access
                </h1>
                <p className="max-w-[700px] text-green-800 dark:text-green-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the essential features of VNCConnect: secure, browser-based remote access with full control or view-only modes. Simple, direct, and safe connections from any device.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-feature-gradient">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Core Features</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">100% Browser-Based</span>
                        <p className="text-sm text-muted-foreground">
                          No downloads or installations required. Works directly in your browser.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">End-to-End Encryption</span>
                        <p className="text-sm text-muted-foreground">
                          All connections are secured with strong encryption for maximum privacy.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Cross-Platform</span>
                        <p className="text-sm text-muted-foreground">
                          Works on Windows, macOS, Linux, iOS, and Android - any device with a modern browser.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Security Features</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Permission Controls</span>
                        <p className="text-sm text-muted-foreground">
                          Granular permission settings to control what remote users can access.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Session Recording</span>
                        <p className="text-sm text-muted-foreground">
                          Record remote sessions for documentation or training purposes.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Privacy Mode</span>
                        <p className="text-sm text-muted-foreground">
                          Temporarily hide sensitive information during remote sessions.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">View-Only Mode</span>
                        <p className="text-sm text-muted-foreground">
                          Allow remote viewing without giving control of keyboard and mouse.
                        </p>
                      </div>
                    </li>
                  </ul>
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
