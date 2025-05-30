import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, MessageSquare, FileText, HelpCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-28 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="text-primary">Support Center</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get help with VNCConnect and find answers to common questions
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-feature-gradient">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Do I need to install any software to use VNCConnect?</AccordionTrigger>
                    <AccordionContent>
                      No, VNCConnect is 100% browser-based. You don't need to install any software or plugins to use it.
                      Simply visit our website and start a remote session directly in your browser.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is VNCConnect secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes, VNCConnect uses end-to-end encryption to secure all connections. Your data never passes
                      through our servers, and all connections are protected with DTLS encryption. We also provide
                      granular permission controls so you can decide exactly what remote users can access.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What browsers are supported?</AccordionTrigger>
                    <AccordionContent>
                      VNCConnect works with all modern browsers, including Chrome, Firefox, Safari, and Edge. For the
                      best performance, we recommend using the latest version of Chrome or Firefox.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I use VNCConnect on mobile devices?</AccordionTrigger>
                    <AccordionContent>
                      Yes, VNCConnect works on mobile devices with modern browsers. You can control a remote computer
                      from your smartphone or tablet, or allow someone to access your mobile device remotely.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Is VNCConnect really free?</AccordionTrigger>
                    <AccordionContent>
                      Yes, VNCConnect is completely free to use with all features included. There are no premium tiers
                      or hidden costs.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Documentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Browse our comprehensive documentation to learn how to use all features of VNCConnect.
                      </p>
                      <Link href="/docs">
                        <Button variant="outline" className="w-full">
                          View Documentation
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Tutorials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Watch video tutorials and step-by-step guides to get the most out of VNCConnect.
                      </p>
                      <Link href="/tutorials">
                        <Button variant="outline" className="w-full">
                          View Tutorials
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Contact Support</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and our support team will get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input id="subject" placeholder="Subject of your inquiry" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea id="message" placeholder="Describe your issue or question" rows={5} />
                      </div>
                      <Button className="w-full">Submit</Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Email Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        For general inquiries, you can email us at{" "}
                        <a href="mailto:support@vncconnect.com" className="text-primary hover:underline">
                          support@vncconnect.com
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Live Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Chat with our support team in real-time during business hours.
                      </p>
                      <Button className="w-full">Start Chat</Button>
                    </CardContent>
                  </Card>
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
