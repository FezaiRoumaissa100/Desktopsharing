import { Apple, Chrome, Database, Download, Laptop, Server, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DownloadSection() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Download VNCConnect</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Available for all major platforms and devices
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Tabs defaultValue="desktop" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="desktop">
                <Laptop className="mr-2 h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile
              </TabsTrigger>
              <TabsTrigger value="server">
                <Server className="mr-2 h-4 w-4" />
                Server
              </TabsTrigger>
            </TabsList>
            <TabsContent value="desktop" className="p-4 border rounded-lg mt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Laptop className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Windows</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Apple className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">macOS</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Linux</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="mobile" className="p-4 border rounded-lg mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Android</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Google Play
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Apple className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">iOS</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    App Store
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="server" className="p-4 border rounded-lg mt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Server className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Windows Server</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Linux Server</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-background p-3">
                    <Chrome className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Web Client</h3>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Access
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
