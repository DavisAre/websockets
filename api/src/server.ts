import express, { Request, Response } from 'express';
import http from 'http';
import socketIO, { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const port = 3000;

const server = http.createServer(app);
const io: SocketIOServer = new socketIO.Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript and Socket.io!');
});

// Store connected clients in an array
const connectedClients: Socket[] = [];
const chatMessages: string[] = []; // Array to store chat messages

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Add the connected socket to the array
  connectedClients.push(socket);

  // Emit chat messages to the newly connected client
  socket.emit('initialChatMessages', chatMessages);

  // Emit drawing events to the newly connected client
  socket.on('drawing:start', (data) => {
    // Broadcast the drawing start event to all connected clients except the sender
    socket.broadcast.emit('drawing:start', data);
  });

  socket.on('drawing:draw', (data) => {
    // Broadcast the drawing draw event to all connected clients except the sender
    socket.broadcast.emit('drawing:draw', data);
  });

  socket.on('drawing:end', () => {
    // Broadcast the drawing end event to all connected clients except the sender
    socket.broadcast.emit('drawing:end');
  });

  socket.on('requestInitialMessages', () => {
    // Send the initial chat messages to the requesting client
    socket.emit('initialChatMessages', chatMessages);
  });

  // Handle custom socket events here
  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Remove the disconnected socket from the array
    const index = connectedClients.indexOf(socket);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });

  socket.on('clientEvent', (data: any) => {
    console.log('clientEvent received', data);
  });

  // Handle chat messages
  socket.on('sendMessage', (message: string) => {
    console.log('Received chat message:', message);

    // Store the message in the array
    chatMessages.push(message);

    // Broadcast the message to all connected clients
    io.emit('chatMessage', message);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
