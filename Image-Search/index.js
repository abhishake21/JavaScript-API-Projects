const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

// Rate Limit
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50
});
app.use(limiter);
app.set('trust proxy', 1);

// Set Static Folder
app.use(express.static('public'))

// Routes
app.use('/image', require('./routes/getimages'));

// Enable CORS
app.use(cors());

app.listen(PORT, () => console.log(`Server running on ${PORT}`));