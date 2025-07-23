const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/apiRoutes');
const Url = require('./models/Url');
const cors = require('cors'); // ✅ CORS imported

const app = express();
const PORT = 5000;

app.use(cors()); // ✅ Allow all origins by default — add BEFORE routes
app.use(bodyParser.json());
app.use('/api', urlRoutes); // For POST /api/shorten

// 🔴 GET route for redirection:
app.get('/:shortId', async (req, res) => {
  try {
    const urlEntry = await Url.findOne({ shortCode: req.params.shortId });

    if (!urlEntry) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Expiration check
    if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
      return res.status(410).json({ error: 'Short URL has expired' });
    }

    return res.redirect(urlEntry.originalUrl);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

mongoose.connect('mongodb://localhost:27017/shorturl', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
