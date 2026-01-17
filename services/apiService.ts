/**
 * Service API pour communiquer avec le backend Python
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  suggestions?: string[];
}

export interface StartConversationResponse {
  conversation_id: string;
  welcome_message: string;
}

class ApiService {
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
        throw new Error(error.detail || `Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  async startConversation(): Promise<StartConversationResponse> {
    return this.fetchWithErrorHandling<StartConversationResponse>('/api/chat/start', {
      method: 'POST',
    });
  }

  async sendMessage(
    message: string,
    conversationId?: string,
    history?: ChatMessage[]
  ): Promise<ChatResponse> {
    const body: ChatRequest = {
      message,
      conversation_id: conversationId,
      history,
    };

    return this.fetchWithErrorHandling<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.fetchWithErrorHandling(`/api/chat/${conversationId}`, {
      method: 'DELETE',
    });
  }

  async checkHealth(): Promise<{ status: string }> {
    return this.fetchWithErrorHandling<{ status: string }>('/api/health');
  }
}

export const apiService = new ApiService();

