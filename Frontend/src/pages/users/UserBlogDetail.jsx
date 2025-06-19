import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import { server_url } from '../../utils/script';

const UserBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);

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

  useEffect(() => {
    // Fetch all blogs for next/prev navigation
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(`${server_url}/api/blogs`);
        setAllBlogs(response.data.blogs || []);
      } catch (error) {
        setAllBlogs([]);
      }
    };
    fetchAllBlogs();
  }, []);

  const handleNextBlog = () => {
    if (!allBlogs.length || !blog) return;
    const idx = allBlogs.findIndex(b => b._id === blog._id);
    if (idx !== -1 && idx < allBlogs.length - 1) {
      navigate(`/user/blogs/${allBlogs[idx + 1]._id}`);
    }
  };

  const handlePrevBlog = () => {
    if (!allBlogs.length || !blog) return;
    const idx = allBlogs.findIndex(b => b._id === blog._id);
    if (idx > 0) {
      navigate(`/user/blogs/${allBlogs[idx - 1]._id}`);
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
      <Card>
        <CardMedia
          component="img"
          height="350"
          image={`${server_url}${blog.image}`}
          alt={blog.title}
          sx={{ objectFit: 'contain' }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{blog.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {blog.category}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {blog.summary}
          </Typography>
          <Box mt={3}>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={handlePrevBlog} disabled={allBlogs.findIndex(b => b._id === blog._id) === 0}>
              Previous Blog
            </Button>
            <Button variant="outlined" onClick={handleNextBlog} disabled={allBlogs.findIndex(b => b._id === blog._id) === allBlogs.length - 1}>
              Next Blog
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserBlogDetail; 