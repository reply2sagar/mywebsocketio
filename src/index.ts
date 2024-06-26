import { Socket } from "socket.io";
import path from 'path';
import express from 'express';
import http from 'http';
const SocketServer = require('socket.io');

const app = express();


app.use(express.static('public'));

// app.use(express.static(path.join(__dirname, '../public')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

const httpServer = http.createServer(app);

const socketServer = SocketServer(httpServer, {
    cors: {
      origin: 'http://127.0.0.1:5500', // Replace with your frontend URL or an array of allowed origins
      methods: ['GET', 'POST'], // Allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
      credentials: true // Allow credentials (cookies, authorization headers, etc.)
    }
  });


    socketServer.on('connection', (socket :Socket) => {
    console.log('a user connected');

    socket.on('offer', (data) => {
      socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
      socket.broadcast.emit('answer', data);
    });

    socket.on('candidate', (data) => {
      socket.broadcast.emit('candidate', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });


httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
