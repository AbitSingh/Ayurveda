const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Blog routes
router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.delete('/:id', blogController.deleteBlog);
router.put('/:id', blogController.updateBlog);

module.exports = router; 