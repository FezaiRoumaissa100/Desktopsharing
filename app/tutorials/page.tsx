import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function TutorialsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background">
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 text-center">
          <div className="space-y-8 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Tutorials Coming Soon
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              We're working hard to create comprehensive tutorials to help you get the most out of our platform. 
              Stay tuned for step-by-step guides, best practices, and expert tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gap-2">
                <Mail className="h-4 w-4" />
                Notify Me When Available
              </Button>
            </div>
            <div className="pt-8">
              <div className="inline-flex items-center justify-center w-full">
                <div className="h-1 w-64 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
              </div>
              <p className="pt-4 text-sm text-gray-500 dark:text-gray-400">
                Expected launch: Q2 2025
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 