import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext'; // Adjust the path as needed

export const Chat = () => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (socket) {
      // Listen for incoming chat messages from the server
      socket.on('chatMessage', (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Listen for initial chat messages when connected
      socket.on('initialChatMessages', (initialMessages: string[]) => {
        console.log('initialChatMessages', initialMessages)
        setMessages(initialMessages);
      });
      socket.emit('requestInitialMessages');
    }

  }, [socket]);

  const handleSendMessage = () => {
    if (socket && newMessage) {
      // Send the chat message to the server
      socket.emit('sendMessage', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className='w-full'>
      <h3 className='font-bold'>Messages:</h3>
      <div>
        {messages.map((message, index) => (
          <div className='p-3 my-2 border-gray-600 border' key={index}>{message}</div>
        ))}
      </div>
      <div className='flex space-x-3'>
        <input
          type="text"
          className='border border-gray-600'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className='border border-gray-600' onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
