import { Chatbot } from '@/components/chatbot';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Orientation Académique IUC
          </h1>
          <p className="text-gray-600">
            Découvrez la filière qui correspond à vos aspirations
          </p>
        </div>
        <Chatbot />
      </div>
    </div>
  );
}