const express = require('express');
const { createAdminSeeder, adminLogin } = require('../controllers/adminController');
const router = express.Router();

// router.post('/', createAdminSeeder);

// router.post("/login", adminLogin);
module.exports = router;