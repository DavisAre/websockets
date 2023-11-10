import { useState, useEffect } from 'react';
import './App.css';
import { io, Socket } from 'socket.io-client';

function App() {
  const [count, setCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Establish a connection to the Socket.io server
    const socket = io('http://localhost:3000'); // Replace with your server URL

    socket.on('connect', () => {
      console.log('Connected to the server');
      setSocket(socket);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for a custom event from the server
      socket.on('serverEvent', (data: any) => {
        console.log('Received data from the server:', data);
      });
    }
  }, [socket]);

  const emitClientEvent = () => {
    if (socket) {
      // Emit a custom event to the server
      socket.emit('clientEvent', { message: 'Hello from the client!' });
    }
  };

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR...
        </p>
        <button onClick={emitClientEvent}>Send Data to Server</button>
      </div>
    </>
  );
}

export default App;
