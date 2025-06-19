const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        console.log('Received blog creation request:', req.body); // Debug log
        console.log('Files received:', req.files); // Debug log

        if (!req.files || !req.files.image) {
            return res.status(400).json({
                error: true,
                message: "Blog image is required"
            });
        }

        const uploadPath = 'public/uploads/blogs';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const image = req.files.image;
        const fileName = Date.now() + '-' + image.name.replace(/\s+/g, '-');
        const imagePath = '/uploads/blogs/' + fileName;

        // Move the file to upload directory
        await image.mv(path.join(uploadPath, fileName));
        
        const blog = new Blog({
            title: req.body.title,
            category: req.body.category,
            summary: req.body.summary,
            content: req.body.content,
            image: imagePath
        });

        const savedBlog = await blog.save();
        console.log('Blog saved successfully:', savedBlog); // Debug log

        res.status(201).json({
            error: false,
            message: "Blog created successfully",
            blog: savedBlog
        });
    } catch (error) {
        console.error('Error in blog creation:', error); // Debug log
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Get all blogs
exports.getBlogs = async (req, res) => {
    try {
        console.log('Fetching all blogs'); // Debug log
        const blogs = await Blog.find().sort({ createdAt: -1 });
        console.log('Found blogs:', blogs); // Debug log

        res.status(200).json({
            error: false,
            blogs: blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error); // Debug log
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                error: true,
                message: "Blog not found"
            });
        }

        // Delete the associated image file
        if (blog.image) {
            const imagePath = path.join(__dirname, '../public', blog.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Blog.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            error: false,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                error: true,
                message: "Blog not found"
            });
        }

        const updateData = {
            title: req.body.title,
            category: req.body.category,
            summary: req.body.summary,
            content: req.body.content,
            updatedAt: Date.now()
        };

        // Handle image update if new image is uploaded
        if (req.files && req.files.image) {
            // Delete old image
            if (blog.image) {
                const oldImagePath = path.join(__dirname, '../public', blog.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const image = req.files.image;
            const fileName = Date.now() + '-' + image.name.replace(/\s+/g, '-');
            const uploadPath = 'public/uploads/blogs';
            
            // Move the new file to upload directory
            await image.mv(path.join(uploadPath, fileName));
            
            // Add new image path
            updateData.image = '/uploads/blogs/' + fileName;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            error: false,
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: true, message: 'Blog not found' });
        }
        res.status(200).json({ error: false, blog });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}; 