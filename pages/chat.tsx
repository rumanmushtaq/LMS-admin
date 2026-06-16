import React, { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { useChatSocket } from '../hooks/useChatSocket';
import { Text } from '@nextui-org/react';

// Assuming you have a way to get the admin's auth token
// const token = useAuthStore(state => state.token);

const AdminChatPage = () => {
  // Pass the token once auth is fully integrated
  const { isConnected, messages, sendMessage, typing } = useChatSocket('ADMIN_TOKEN_PLACEHOLDER');
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage('example-conversation-id', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <Text h3>Admin Chat Support</Text>
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <Text>{isConnected ? 'Connected to Chat Server' : 'Disconnected'}</Text>
        </div>

        <div className="mt-8 border rounded-lg h-[600px] flex">
          {/* Conversation List Sidebar */}
          <div className="w-1/3 border-r p-4 bg-gray-50">
            <Text h4>Conversations</Text>
            <div className="mt-4">
              <p className="text-sm text-gray-500">No active conversations...</p>
            </div>
          </div>

          {/* Active Chat Window */}
          <div className="w-2/3 flex flex-col bg-white">
            <div className="p-4 border-b">
              <Text h4>Select a conversation</Text>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className="mb-2 p-2 bg-blue-50 rounded-lg max-w-md">
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  typing('example-conversation-id');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminChatPage;
