/*const Url = require('../models/Url');

// Function to generate a random short code
function generateShortCode(length = 9) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST: Shorten URL
const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  try {
    const shortCode = generateShortCode();
    const shortUrl = `http://localhost:5000/${shortCode}`;

    const newEntry = new Url({
      originalUrl,
      shortCode,
      createdAt: new Date(),
    });

    await newEntry.save();

    return res.json({ originalUrl, shortUrl, shortCode });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET: Redirect to original URL
const redirectToOriginalUrl = async (req, res) => {
  const { shortId } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortCode: shortId });

    if (urlEntry) {
      return res.redirect(urlEntry.originalUrl);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  shortenUrl,
  redirectToOriginalUrl,
}; */
const Url = require('../models/Url');

function generateShortCode(length = 9) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const shortenUrl = async (req, res) => {
  const { originalUrl, customCode, expiresInMinutes } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  let shortCode = customCode || generateShortCode();

  try {
    // Check for collision until unique
    while (await Url.findOne({ shortCode }).collation({ locale: 'en', strength: 2 })) {
      if (customCode) {
        return res.status(409).json({ error: 'Short code already exists. Try a different custom name.' });
      }
      shortCode = generateShortCode(); // Regenerate only if not custom
    }

    const expiresAt = expiresInMinutes
      ? new Date(Date.now() + expiresInMinutes * 60 * 1000)
      : null;

    const newUrl = new Url({
      originalUrl,
      shortCode,
      expiresAt,
    });

    await newUrl.save();

    const shortUrl = `http://localhost:5000/${shortCode}`;

    return res.json({ originalUrl, shortUrl, shortCode, expiresAt });
  } catch (err) {
    console.error('Error shortening URL:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  shortenUrl,
  
};
 

