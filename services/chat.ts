import { HTTP_CLIENT } from "../utils/axiosClient";


class ChatService {
  /**
   * Every conversation in the system, for moderation.
   *
   * This used to call the participant-scoped endpoint, so the "All Chats" tab
   * only showed conversations the admin was personally in.
   */
  async getAllConversations(skip = 0, limit = 50): Promise<any> {
    const { data } = await HTTP_CLIENT.get('/api/v1/chat/admin/conversations', {
      params: { skip, limit },
    });
    return data;
  }

  async getFlaggedMessages(skip = 0, limit = 50): Promise<any> {
    const { data } = await HTTP_CLIENT.get('/api/v1/chat/admin/messages/flagged', {
      params: { skip, limit },
    });
    return data;
  }

  async resolveFlaggedMessage(messageId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(`/api/v1/chat/admin/messages/${messageId}/resolve`);
    return data;
  }

  async blockConversation(conversationId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(`/api/v1/chat/conversations/${conversationId}/block`);
    return data;
  }

  // Admin's own conversations
  async getUserConversations(skip = 0, limit = 50): Promise<any> {
    const { data } = await HTTP_CLIENT.get('/api/v1/chat/conversations', {
      params: { skip, limit },
    });
    return data;
  }

  // Common API methods (also used by admin if they initiate chat)
  async initConversation(targetUserId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post('/api/v1/chat/conversations', { targetUserId });
    return data;
  }

  async getMessages(conversationId: string, skip = 0, limit = 50): Promise<any> {
    const { data } = await HTTP_CLIENT.get(`/api/v1/chat/conversations/${conversationId}/messages`, {
      params: { skip, limit },
    });
    return data;
  }
}

export default new ChatService();
