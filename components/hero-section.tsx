import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 to-green-200">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Secure Remote Access <span className="text-green-600">in Your Browser</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Connect to any device, anywhere, with no downloads required. Fast, secure, and completely free.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/start-session">
              <Button size="lg" className="gap-1 bg-green-600 hover:bg-green-700 text-white">
                Start Remote Session
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
