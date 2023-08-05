import ApiManager from './ApiManager';


const getConversationId = async (token, receiverId) => {
  try {
    const response = await ApiManager.get(`/chat-utils/${receiverId}`, {
      headers: { 'Authorization': `Bearer ${token}`},
    });
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

const getLastMessage = async (token, conversationId) => {
  try {
   const response = await ApiManager.get(`/chat-utils/messages/${conversationId}/last`, { 
      headers: {'Authorization': `Bearer ${token}`}
    });
    const lastMessage = response.data;

    return lastMessage;
  } catch (error) {
    console.log('Error getting last message:', error);
  }
};


export { getConversationId, getMessages, getLastMessage };
