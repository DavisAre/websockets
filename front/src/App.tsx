import { useEffect, useContext } from 'react';
import './App.css';
// import { io, Socket } from 'socket.io-client';
import { SocketContext } from "./context/SocketContext";
import { Chat } from "./components/Chat";
import { Canvas } from "./components/Canvas";

function App() {
  // const [count, setCount] = useState(0);
  const socket = useContext(SocketContext);


  useEffect(() => {
    if (socket) {
      // Listen for a custom event from the server
      socket.on('serverEvent', (data: any) => {
        console.log('Received data from the server:', data);
      });
    }
  }, [socket]);

  return (
    <>
      <div className="wrapper w-full">
        <Canvas />
        <Chat />
      </div>
    </>
  );
}

export default App;
