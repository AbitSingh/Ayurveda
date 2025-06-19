import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Paper } from '@mui/material';
import BlogForm from '../../components/BlogForm';
import BlogList from '../../components/BlogList';
import {server_url, getCookie} from '../../utils/script.jsx';

const AdminBlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server_url}/api/blogs`);
      setBlogs(response.data.blogs || []); // Always set as array
    } catch (error) {
      setBlogs([]);
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleBlogSubmit = async (blogData) => {
    try {
      await axios.post(`${server_url}/api/blogs`, blogData);
      fetchBlogs(); // Refresh the blog list
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleBlogDelete = async (blogId) => {
    try {
      await axios.delete(`${server_url}/api/blogs/${blogId}`);
      fetchBlogs(); // Refresh the blog list
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Blog Management
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Blog
        </Typography>
        <BlogForm onSubmit={handleBlogSubmit} />
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Blog List ({blogs.length})
        </Typography>
        <BlogList 
          blogs={blogs} 
          loading={loading} 
          isAdmin={true}
          onDelete={handleBlogDelete}
        />
      </Paper>
    </Container>
  );
};

export default AdminBlogManagement; 