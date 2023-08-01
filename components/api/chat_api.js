import ApiManager from './ApiManager';


const getConversationId = async (token, senderId, receiverId) => {
  try {
    const response = await ApiManager.get(`/chat-utils/${receiverId}`, {
      baseURL: 'http://10.16.6.20:8080',
      headers: { Authorization: `Bearer ${token}`,'x-auth-user-id': `${senderId}`},
    });
    // console.error('Response:', JSON.stringify(response));
    const conversationId = response.data;
    console.log('Conversation ID:', conversationId);
    return conversationId;
  } catch (error) {
    console.error('Error getting conversation ID:', error);
  }
};

const getMessages = async (conversationId) => {
  try {
    console.log(`\n\n\n/chat-utils/messages/${conversationId}\n\n\n`)
    const response = await ApiManager.get(`/chat-utils/messages/${conversationId}`, { baseURL: 'http://10.16.6.20:8080'});
    const messages = response.data;
    console.log('Response:', response.data);

    return messages;
  } catch (error) {
    console.error('Error getting chat messages:', error);
  }
};

export { getConversationId, getMessages };
