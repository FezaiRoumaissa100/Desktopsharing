import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 bg-hero-gradient">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Secure Remote Access <span className="text-brand-600 dark:text-brand-400">in Your Browser</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Connect to any device, anywhere, with no downloads required. Fast, secure, and completely free.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/start-session">
              <Button size="lg" className="gap-1 bg-brand-600 hover:bg-brand-700 text-white">
                Start Remote Session
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-brand-600 text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
