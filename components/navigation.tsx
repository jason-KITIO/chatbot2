import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-xl text-gray-800">IUC</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Orientation
            </Link>
            <Link 
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Connexion
            </Link>
            <Button asChild size="sm">
              <Link href="/singup">
                S'inscrire
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}