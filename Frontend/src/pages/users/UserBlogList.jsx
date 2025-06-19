import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress } from '@mui/material';
import { server_url } from '../../utils/script';
import { useNavigate } from 'react-router-dom';

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server_url}/api/blogs`);
        setBlogs(response.data.blogs || []);
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blogs.length) {
    return (
      <Container>
        <Typography variant="h5" align="center" mt={4}>No blogs available.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Latest Blogs</Typography>
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`${server_url}${blog.image}`}
                alt={blog.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {blog.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.summary}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button variant="outlined" fullWidth onClick={() => navigate(`/user/blogs/${blog._id}`)}>
                  Read More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserBlogList; 