import ApiManager from './ApiManager';


const getConversationId = async (token, senderId, receiverId) => {
  try {
    const response = await ApiManager.get(`/chat-utils/${receiverId}`, {
      headers: { 'Authorization': `Bearer ${token}`,'x-auth-user-id': `${senderId}`},
    });
    console.log('Response:', JSON.stringify(response));
    const conversationId = response.data;
    console.log('Conversation ID:', conversationId);
    return conversationId;
  } catch (error) {
    console.error('Error getting conversation ID:', error);
  }
};

const getMessages = async (token, conversationId) => {
  try {
    console.log(`\n\n\n/chat-utils/messages/${conversationId}\n\n\n`)
    const response = await ApiManager.get(`/chat-utils/messages/${conversationId}`, { 
      headers: {'Authorization': `Bearer ${token}`}
    });
    const messages = response.data;

    return messages;
  } catch (error) {
    console.log('Error getting chat messages:', error);
  }
};

export { getConversationId, getMessages };
