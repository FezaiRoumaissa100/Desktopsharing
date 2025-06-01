import Link from "next/link"
import { Facebook, Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between text-center md:flex-row md:text-left">
        <div className="flex items-center space-x-2 mb-6 md:mb-0">
          <span className="text-3xl font-bold text-white">VNC Web</span>
        </div>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="hover:text-green-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-green-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-green-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-green-400 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-6 md:mt-0">
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">
            <Github className="h-6 w-6" />
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} VNC Web. All rights reserved.
      </div>
    </footer>
  )
}
