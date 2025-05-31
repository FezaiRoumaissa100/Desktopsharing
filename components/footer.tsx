import Link from "next/link"
import { Facebook, Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">VNC Web</span>
        </div>
        <div className="flex space-x-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
