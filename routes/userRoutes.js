const express = require('express');
const { createUser } = require('../controllers/userController');
const router = express.router();

router.post('/', createUser);


module.exports = router;