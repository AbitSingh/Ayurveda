import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { server_url } from '../utils/script';
import { useNavigate } from 'react-router-dom';

const BlogList = ({ blogs = [], loading, isAdmin, onDelete }) => {
  const navigate = useNavigate();
  console.log('Blogs received in BlogList:', blogs); // Debug log

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if blogs is an array and has items
  const hasBlogs = Array.isArray(blogs) && blogs.length > 0;
  console.log('hasBlogs:', hasBlogs); // Debug log
  
  if (!hasBlogs) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center">
        No blogs available.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {blogs.map((blog) => {
        console.log('Rendering blog:', blog); // Debug individual blog
        return (
          <Grid item xs={12} sm={6} md={4} key={blog._id || blog.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`${server_url}${blog.image}`}
                alt={blog.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {blog.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.summary}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button size="small" color="primary" variant="contained" onClick={() => navigate(`/user/blogs/${blog._id}`)}>
                  Read More
                </Button>
                
                {isAdmin && (
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      aria-label="edit blog"
                      onClick={() => navigate(`/admin/blogManagement/update/${blog._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      aria-label="delete blog"
                      onClick={() => onDelete(blog._id || blog.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BlogList; 