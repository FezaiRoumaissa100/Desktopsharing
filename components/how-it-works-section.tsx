import { Monitor, Lock } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-green-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="text-green-600">How It Works</span>
            </h2>
            <p className="max-w-[700px] text-green-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Connect in two simple steps: share your secure connection details, then connect from another device.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              1
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Monitor className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Share Your Connection Details</h3>
            <p className="text-center text-green-800">
              On the device to be controlled, click "Share my screen" to generate your secure connection credentials. Communicate these details to the person who will connect.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              2
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Connect Remotely</h3>
            <p className="text-center text-green-800">
              On the controlling device, click "Access a screen" and enter the connection details to start the remote session securely in your browser.
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <div className="max-w-3xl text-center">
            <p className="text-green-800">
              VNCConnect makes remote access simple: no code, no chat, just share your secure connection credentials for instant connection. All sessions are secured and run directly in your browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
