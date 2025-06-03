import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { BookOpen, Mail } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background">
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 text-center">
          <div className="space-y-8 max-w-3xl">
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Documentation Coming Soon
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Our team is currently working on detailed documentation to help you understand and make the most of our platform's features.
              The documentation will include API references, integration guides, and troubleshooting tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gap-2">
                <Mail className="h-4 w-4" />
                Get Notified When Live
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-2">API Documentation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive API references and examples</p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-2">Integration Guides</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step integration tutorials</p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Security and performance recommendations</p>
              </div>
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