import { Monitor, Laptop, Lock } from "lucide-react"

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
              Connect to any device in three simple steps
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              1
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Monitor className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Generate Access Code</h3>
            <p className="text-center text-green-800">
              On the device you want to control, visit our website and generate a unique access code
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              2
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Laptop className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Enter Code on Controller</h3>
            <p className="text-center text-green-800">
              On your controlling device, enter the access code to establish a connection
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              3
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Secure Connection Established</h3>
            <p className="text-center text-green-800">
              An encrypted peer-to-peer connection is established, allowing secure remote control
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <div className="max-w-3xl text-center">
            <p className="text-green-800">
              Our technology uses WebRTC with end-to-end encryption to create a direct connection between devices. Your
              data never passes through our servers, ensuring maximum privacy and security.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
