const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const { Server } = require('socket.io');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let io; 

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const setIO = require('./controller/user.controller').setIO;
  setIO(io);

  io.on('connection', (socket) => {
    console.log('New socket connection with ' + socket.id);

    socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
    });
  });
});
