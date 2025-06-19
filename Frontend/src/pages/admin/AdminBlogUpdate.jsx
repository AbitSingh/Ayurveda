import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import BlogForm from '../../components/BlogForm';
import { server_url, getCookie } from '../../utils/script';

const AdminBlogUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server_url}/api/blogs/${id}`);
        setBlog(response.data.blog);
      } catch (error) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const token = getCookie("userToken");
      await axios.put(`${server_url}/api/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/admin/blogManagement');
    } catch (error) {
      alert('Failed to update blog');
    }
  };

  if (loading || !blog) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Update Blog</Typography>
      <Card>
        <CardMedia
          component="img"
          height="250"
          image={`${server_url}${blog.image}`}
          alt={blog.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <BlogForm onSubmit={handleUpdate} initialData={blog} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminBlogUpdate; 