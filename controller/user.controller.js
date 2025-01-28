const User = require('../models/user.mongo');

let io;

exports.setIO = (socketIO) => {
  io = socketIO;
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    const images = req.files.map((file) => file.path);

    const newUser = new User({ name, socialMediaHandle, images });
    await newUser.save();
    console.log("here is new user", newUser);
    if (io) {
      console.log("socket emitted", newUser);
      io.emit('new-user', newUser);
    } else {
      console.error('Socket.io is not initialized');
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};
