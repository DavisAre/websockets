import express, { Request, Response } from 'express';
import http from 'http';
import socketIO, { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors'; // Import the cors package

const app = express();
const port = 3000;

// Create an HTTP server using the Express app.
const server = http.createServer(app);

// Initialize Socket.io and attach it to the server.
const io: SocketIOServer = new socketIO.Server(server, {
  cors: {
    origin: '*', // Allow all origins
  },
});

// Use the cors middleware to enable CORS for all routes in your Express app
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript and Socket.io!');
});

// Socket.io event handling
io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Handle custom socket events here
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('clientEvent', (data: any) => {
    console.log('clientEvent received', data)
  })
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
