import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { server_url } from '../utils/script';

const BlogForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
      });
      setPreviewUrl(initialData.image ? `${server_url}${initialData.image}` : '');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create FormData object for multipart/form-data
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('summary', formData.summary);
    submitData.append('content', formData.content);
    if (image) {
      submitData.append('image', image);
    }
    await onSubmit(submitData);
    if (!initialData) {
      setFormData({
        title: '',
        category: '',
        summary: '',
        content: '',
      });
      setImage(null);
      setPreviewUrl('');
    }
  };

  const categories = [
    'Ayurvedic Medicine',
    'Herbal Remedies',
    'Wellness Tips',
    'Health & Lifestyle',
    'Traditional Practices'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Blog Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            label="Category"
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          required
          fullWidth
          label="Summary"
          name="summary"
          multiline
          rows={2}
          value={formData.summary}
          onChange={handleChange}
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Blog Image
          </Typography>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ marginBottom: '1rem' }}
          />
          {previewUrl && (
            <Box mt={2}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ height: 300 }}>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            style={{ height: '250px' }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          {initialData ? 'Update Blog' : 'Publish Blog'}
        </Button>
      </Stack>
    </Box>
  );
};

export default BlogForm; 