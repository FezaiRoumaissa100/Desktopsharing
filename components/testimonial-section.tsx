import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function TestimonialSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trusted by Thousands</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers have to say about VNCConnect
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  width={60}
                  height={60}
                  alt="User avatar"
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">IT Manager</div>
                </div>
              </div>
              <div className="flex py-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "VNCConnect has transformed how our IT team provides support. The speed and reliability are unmatched."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  width={60}
                  height={60}
                  alt="User avatar"
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Software Developer</div>
                </div>
              </div>
              <div className="flex py-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "I can access my work computer from anywhere with perfect performance. The security features give me
                peace of mind."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  width={60}
                  height={60}
                  alt="User avatar"
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">Emily Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Small Business Owner</div>
                </div>
              </div>
              <div className="flex py-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "As a small business, VNCConnect has been a game-changer for our remote team. Worth every penny!"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
