const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const authController = require('../controllers/authController');

const csrfProtection = csrf({ cookie: false }); // secret stored in cookie-session

router.get('/csrf-token', csrfProtection, authController.getCsrfToken);
router.post('/login', csrfProtection, authController.login);
router.get('/login/callback', (req, res) => res.send("hi"));
module.exports = router;