// server.js
const { createServer } = require('http');
const { Server } = require('socket.io');

// Minimal HTTP server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (replace with your frontend URL in production)
  }
});

// Track online users (simple example)
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle new user joining
  socket.on('join', (username) => {
    onlineUsers.set(socket.id, username);
    io.emit('onlineUsers', Array.from(onlineUsers.values())); // Broadcast updated list
  });

  // Handle messages
  socket.on('sendMessage', (message) => {
    const username = onlineUsers.get(socket.id);
    io.emit('receiveMessage', { text: message, sender: username, timestamp: Date.now() });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.values()));
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});