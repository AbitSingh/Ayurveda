const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import routes
const blogRoutes = require('./routes/blogRoutes');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Frontend/views'));

// Import routes AFTER middleware
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

// Serve static files
app.use(express.static(path.join(__dirname, './public')));

// Routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/api/blogs', blogRoutes);
app.use('/api', chatRouter);

// Connect DB
const db = require('./db.config.js');
//db.connect(); // Changed from sequelize.sync() to connect()

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: true,
        message: err.message || 'Something went wrong!'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
    if (error) {
        console.log('Error in starting the server: ', error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});