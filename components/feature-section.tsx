import { Globe, Lock, Zap, Monitor, Users, MessageSquare } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-green-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="text-green-600">Key Features</span>
            </h2>
            <p className="max-w-[700px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need for seamless browser-based remote access
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 p-6 shadow-sm bg-white">
            <div className="p-3 rounded-full bg-green-100">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">100% Browser-Based</h3>
            <p className="text-center text-green-800">
              Works directly in your browser - no downloads or installations required
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 p-6 shadow-sm bg-white">
            <div className="p-3 rounded-full bg-green-100">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">End-to-End Encryption</h3>
            <p className="text-center text-green-800">
              Your connection is fully encrypted and secure from end to end
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 p-6 shadow-sm bg-white">
            <div className="p-3 rounded-full bg-green-100">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Cross-Platform</h3>
            <p className="text-center text-green-800">Works on any device with a modern web browser</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 p-6 shadow-sm bg-white">
            <div className="p-3 rounded-full bg-green-100">
              <Monitor className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Multi-Monitor Support</h3>
            <p className="text-center text-green-800">Seamlessly navigate between multiple screens</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 p-6 shadow-sm bg-white">
            <div className="p-3 rounded-full bg-green-100">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Real-Time Chat</h3>
            <p className="text-center text-green-800">Communicate with the remote user during your session</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-green-200 p-6 shadow-sm bg-white">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Completely Free</h3>
            <p className="text-center text-green-800">All features available at no cost</p>
          </div>
        </div>
      </div>
    </section>
  )
}
