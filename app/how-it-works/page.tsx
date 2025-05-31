import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background text-foreground">
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="text-green-600">How VNCConnect Works</span>
                </h1>
                <p className="max-w-[700px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
                <p className="text-green-800 text-center">
                  VNCConnect uses cutting-edge web technologies to provide secure, high-performance remote access
                  directly in your browser.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-lg border border-border p-6 shadow-sm bg-card">
                    <h3 className="text-xl font-bold mb-2">WebRTC</h3>
                    <p className="text-green-800">
                      We use WebRTC (Web Real-Time Communication) to establish direct peer-to-peer connections between
                      devices. This technology allows for low-latency, high-quality video streaming and data transfer
                      without requiring any plugins or downloads.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-6 shadow-sm bg-card">
                    <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
                    <p className="text-green-800">
                      All connections are secured with DTLS (Datagram Transport Layer Security) encryption, ensuring
                      that your data remains private and secure. Your screen content never passes through our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center">How to Connect in 3 Simple Steps</h2>
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/2 space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-green-800">
                        1
                      </div>
                      <h3 className="text-xl font-bold">Generate an Access Code</h3>
                      <p className="text-green-800">
                        On the device you want to control (the host), visit VNCConnect and click "Allow Remote Access".
                        The system will generate a unique access code that you can share with the person who needs to
                        connect.
                      </p>
                    </div>
                    <div className="md:w-1/2">
                      <div className="rounded-lg border border-border overflow-hidden shadow-sm bg-card">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          width={500}
                          height={300}
                          alt="Generate access code"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
                    <div className="md:w-1/2 space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-green-800">
                        2
                      </div>
                      <h3 className="text-xl font-bold">Enter the Access Code</h3>
                      <p className="text-green-800">
                        On the device you want to control from (the client), visit VNCConnect and click "Connect to
                        Remote". Enter the access code provided by the host to establish a connection.
                      </p>
                    </div>
                    <div className="md:w-1/2">
                      <div className="rounded-lg border border-border overflow-hidden shadow-sm bg-card">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          width={500}
                          height={300}
                          alt="Enter access code"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/2 space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-green-800">
                        3
                      </div>
                      <h3 className="text-xl font-bold">Start Remote Control</h3>
                      <p className="text-green-800">
                        Once connected, you'll see the remote screen in your browser. You can control the mouse and
                        keyboard, transfer files, chat with the remote user, and use all the features of VNCConnect.
                      </p>
                    </div>
                    <div className="md:w-1/2">
                      <div className="rounded-lg border border-border overflow-hidden shadow-sm bg-card">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          width={500}
                          height={300}
                          alt="Remote control session"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Ready to Try It?</h2>
                <p className="text-green-800">
                  Experience the simplicity and power of browser-based remote access with VNCConnect.
                </p>
                <Link href="/connect">
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
