import Header from "@/components/layout/Header";
import HeroSearch from "@/components/home/HeroSearch";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen overflow-y-auto no-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0d1117] to-[#0d1117] flex flex-col">
      {/* Header */}
      <Header variant="dark" />

      {/* Main content */}
      <main className="flex-1">
        <HeroSearch />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2024 DevGrade Engineering. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Changelog
            </Link>
            <Link href="https://github.com" aria-label="GitHub" className="text-gray-500 hover:text-gray-300 transition-colors">
              <Github className="w-4 h-4" />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter" className="text-gray-500 hover:text-gray-300 transition-colors">
              <Twitter className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
