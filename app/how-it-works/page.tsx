import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground">
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="text-brand-600 dark:text-brand-400">How VNC Works</span>
                </h1>
                <p className="max-w-[700px] text-brand-800 dark:text-brand-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Learn how our browser-based remote access solution connects devices securely
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-feature-gradient">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-16">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center">The Technology Behind VNCConnect</h2>
                <p className="text-brand-800 dark:text-brand-200 text-center">
                  VNCConnect uses VNC technology to provide secure, high-performance remote access
                  directly in your browser.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-lg border border-border p-6 shadow-sm bg-card">
                    <h3 className="text-xl font-bold mb-2">VNC</h3>
                    <p className="text-brand-800 dark:text-brand-200">
                      We use VNC (Virtual Network Computing) to establish remote desktop connections between
                      devices. This technology allows for low-latency, high-quality screen sharing and control
                      without requiring any additional plugins or downloads.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-6 shadow-sm bg-card">
                    <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
                    <p className="text-brand-800 dark:text-brand-200">
                      All connections are secured using SSL/TLS (Secure Sockets Layer/Transport Layer Security).
                      This cryptographic protocol ensures secure communication over a computer network, providing
                      confidentiality, integrity, and authentication for the data exchanged between devices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center mb-8">How to Connect in 3 Simple Steps</h2>
                <div className="space-y-20">
                  <div className="flex flex-col md:flex-row md:space-x-16 gap-10 md:gap-0">
                    <div className="flex-1">
                      <div className="flex flex-col gap-8 items-center">
                        <div className="space-y-6">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-brand-800">
                            1
                          </div>
                          <h3 className="text-xl font-bold">Generate an Access Link</h3>
                          <p className="text-brand-800 dark:text-brand-200 text-base">
                            On the host device, click "Share My Screen" and generate a secure access link. This link contains all the information needed to connect securely.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-8 items-center">
                        <div className="space-y-6">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-brand-800">
                            2
                          </div>
                          <h3 className="text-xl font-bold">Share the Link</h3>
                          <p className="text-brand-800 dark:text-brand-200 text-base">
                            Copy the generated access link and send it to the person who needs to connect to your screen (for example, via chat or email).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 items-center w-full md:w-1/2 mx-auto">
                    <div className="space-y-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-brand-800 mx-auto">
                        3
                      </div>
                      <h3 className="text-xl font-bold">Connect Using the Link</h3>
                      <p className="text-brand-800 dark:text-brand-200 text-base">
                        On the client device, click "Access a Screen" and paste the access link you received. You will be connected instantly to the host's screen with the appropriate permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-6 mt-16">
                <h2 className="text-2xl font-bold">Ready to Try It?</h2>
                <p className="text-brand-800 dark:text-brand-200">
                  Experience the simplicity and power of browser-based remote access with VNCConnect.
                </p>
                <Link href="/start-session">
                  <Button size="lg" className="gap-2">
                    Start Remote Session
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
