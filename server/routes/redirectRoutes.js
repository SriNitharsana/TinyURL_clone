/*const express = require('express');
const router = express.Router();
const { redirectToOriginalUrl } = require('../controllers/urlcontroller');

router.get('/:shortId', redirectToOriginalUrl);

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const entry = await Url.findOne({ shortCode }).collation({ locale: 'en', strength: 2 });

    if (!entry || (entry.expiresAt && entry.expiresAt < new Date())) {
      return res.status(404).json({ message: 'Short URL not found or expired.' });
    }

    return res.redirect(entry.originalUrl);
  } catch (err) {
    console.error('Redirection Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


