const express  =require('express');
const { time } = require('../controllers/blog');
const router = express.Router();

router.get('/blogs', time);

module.exports = router;