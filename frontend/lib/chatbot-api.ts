import { getApiUrl, getAuthHeaders } from './api-config';

export interface ChatbotMessage {
  message: string;
}

export interface ChatbotResponse {
  type: 'text' | 'content';
  content: string | any;
}

export async function sendChatbotMessage(message: string): Promise<ChatbotResponse> {
  const response = await fetch(getApiUrl('chatbot'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send message to chatbot');
  }

  return await response.json();
}

export interface ContentData {
  title: string;
  description: string;
  type: string;
  tags: string[];
}

export async function saveContentToLibrary(contentData: ContentData): Promise<any> {
  try {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : null;

    if (!user || !user.id) {
      throw new Error('User not authenticated. Please log in again.');
    }

    const submitData = new FormData();

    // Add form fields
    submitData.append('title', contentData.title);
    submitData.append('description', contentData.description || '');
    submitData.append('type', contentData.type);
    submitData.append('tags', JSON.stringify(contentData.tags || []));
    submitData.append('createdBy', user.id);

    const response = await fetch(getApiUrl('contents'), {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...getAuthHeaders(),
      },
      body: submitData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('saveContentToLibrary error:', errorText);
      throw new Error('Failed to save content: ' + errorText);
    }

    return await response.json();
  } catch (error) {
    console.error('saveContentToLibrary error:', error);
    throw error;
  }
}
