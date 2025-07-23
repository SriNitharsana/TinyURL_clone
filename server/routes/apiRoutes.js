/*const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../controllers/urlcontroller');

// POST: /api/shorten
router.post('/shorten', shortenUrl);

module.exports = router;
*/
const express = require('express');
const router = express.Router();

const { shortenUrl } = require('../controllers/urlcontroller');

router.post('/shorten', shortenUrl);
console.log("shortenUrl is:", shortenUrl);

module.exports = router;



