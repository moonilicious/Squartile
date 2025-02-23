const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Squartile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  avatar: String,
});

const User = mongoose.model('User', UserSchema);

// Google Login Route
app.post('/google-login', async (req, res) => {
  const { name, email, avatar } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, avatar });
      await user.save();
    }

    res.json({ message: 'User authenticated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error });
  }
});

// Start Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
