import { useState, useEffect, useContext } from 'react';
import './App.css';
// import { io, Socket } from 'socket.io-client';
import { SocketContext } from "./context/SocketContext";

function App() {
  const [count, setCount] = useState(0);
  const socket = useContext(SocketContext);


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
