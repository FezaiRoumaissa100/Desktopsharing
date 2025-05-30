import { Globe, Lock, Zap, Monitor, Users, MessageSquare } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-feature-gradient">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="text-primary">Key Features</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need for seamless browser-based remote access
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-border p-6 shadow-sm bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">100% Browser-Based</h3>
            <p className="text-center text-muted-foreground">
              Works directly in your browser - no downloads or installations required
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-border p-6 shadow-sm bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">End-to-End Encryption</h3>
            <p className="text-center text-muted-foreground">
              Your connection is fully encrypted and secure from end to end
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-border p-6 shadow-sm bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Cross-Platform</h3>
            <p className="text-center text-muted-foreground">Works on any device with a modern web browser</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-border p-6 shadow-sm bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Multi-Monitor Support</h3>
            <p className="text-center text-muted-foreground">Seamlessly navigate between multiple screens</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-border p-6 shadow-sm bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Real-Time Chat</h3>
            <p className="text-center text-muted-foreground">Communicate with the remote user during your session</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-border p-6 shadow-sm bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Completely Free</h3>
            <p className="text-center text-muted-foreground">All features available at no cost</p>
          </div>
        </div>
      </div>
    </section>
  )
}
