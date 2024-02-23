const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prakash34we1@gmail.com', // Your Gmail email address
    pass: 'ufml ljcd imia mkcl' // Your Gmail password or App Password for Gmail
  }
});

async function sendOTPEmail(email, otp) {
  // Email content
  const mailOptions = {
    from: 'prakash34we1@gmail.com', // Sender address
    to: email, // List of recipients
    subject: 'Password Reset OTP', // Subject line
    text: `Your OTP for password reset is: ${otp}` // Plain text body
  };

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error occurred while sending email:', error.message);
    throw error;
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}



app.use(cors());
// Connect to MongoDB (Make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/forgotpassword', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/forgotpassword.html'));
});
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/search.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});
// Create a User model
const User = mongoose.model('User', {
  name: String,
  username: String,
  password: String,
  email:String,
  otp:String,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log(req)
  const { name,email, username, password } = req.body;
  if (!name|| !email || !username || !password) {
    return res.status(400).json({ error: "'name, email, username' and 'password' are required." });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists. Choose a different one.' });
    }

    // Create a new user
    const newUser = new User({ name, email, username, password });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    let user;
    // Check if usernameOrEmail is an email address
    if (usernameOrEmail.includes('@')) {
      user = await User.findOne({ email: usernameOrEmail, password });
    } else {
      user = await User.findOne({ username: usernameOrEmail, password });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, 'greeenprem');

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = (req.headers.authorization).slice(7);
  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'greeenprem', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: err });
    }
    req.user = decoded;
    next();
  });
}

app.get('/send-otp', async (req, res) => {
  const { mail } = req.query;

  // Check if the email is from a valid user
  console.log(mail)
  const user = await User.findOne({email:mail});
  console.log(user)
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  else{

  const otp = generateOTP();

  
    await sendOTPEmail(mail, otp.toString());
    // Update the OTP for the user in the database 
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    user.otp = otp.toString()+currentTimeInSeconds.toString();
    await user.save();
    res.status(200).json({ message: 'OTP sent successfully' });
  }
});

// Endpoint to set new password
app.post('/set-password', bodyParser.json(), async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches and is still valid
    if (user.otp.slice(0,6) !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is still valid (sent within the last 10 minutes)
    const otpSentTimestamp = parseInt(otp.substring(6));
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - otpSentTimestamp > 601) {
      return res.status(401).json({ message: 'OTP expired' });
    }

    // Update user's password
    user.password = password;
    user.otp = null; // Reset OTP
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update password:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
});




// Names endpoint (accessible with token)
app.post('/names', verifyToken, async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: "'name' and 'url' are required." });
  }

  // Save the name and URL to the database or perform desired operations
  console.log(req.user)
  var username=req.user.username;
  const newName = new names({ name, url, username});
    await newName.save();
  // For simplicity, let's just log them for now
  console.log('Name:', name);
  console.log('URL:', url);

  res.status(200).json({ message: 'Name and URL saved successfully' });
});

// Names endpoint with GET param (accessible with token)

  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get('/user', verifyToken, async (req, res) => {
  try {
    // Ensure req.user.username exists
    if (!req.user || !req.user.username) {
      return res.status(400).json({ error: "Username not provided" });
    }

    // Fetch the user document from the database for the specified username
    const username = req.user.username;
    const user = await User.findOne({ username }).select("-password");
    

    // If no user document is found for the given username
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If a user document is found, send it in the response
    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  });