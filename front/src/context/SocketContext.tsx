import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
  children: ReactNode;
}

// Create a context for the socket

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Establish a connection to the Socket.io server
    const newSocket = io('http://localhost:3000'); // Replace with your server URL

    newSocket.on('connect', () => {
      console.log('Connected to the server');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
