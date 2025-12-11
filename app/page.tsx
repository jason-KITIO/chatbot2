import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          🎓 IUC
        </h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Institut Universitaire du Cameroun
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Découvrez votre parcours académique idéal avec notre assistant d'orientation intelligent
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            🎓 Commencer l'orientation
          </Link>
          
          <div className="flex gap-4 justify-center mt-6">
            <Link 
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Se connecter
            </Link>
            <Link 
              href="/singup"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
