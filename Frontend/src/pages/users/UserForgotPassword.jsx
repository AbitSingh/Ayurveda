import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { server_url, getCookie } from '../../utils/script.jsx'; // Adjust the import path as necessary

function UserForgotPassword() {

  const navigate = useNavigate();  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState(''); // 'success' or 'danger'

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email format check
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      setVariant('danger');
      return;
    }

    try {
      console.log("Sending forgot password request for email:", email);  
      const res = await axios.post(`${server_url}/user/forgot-password`, { email });
      if(error){
        console.error("Error in forgot password request:", error);
        setMessage('An error occurred. Please try again.');
        setVariant('danger');
        return;
      }else{
        console.log("Email sent successfully:", res.data);
        toast.success('Email sent successfully. Please check your inbox.');
      }


      setMessage('If this email exists, a password reset link has been sent.');
      setVariant('success');
      setEmail('');
    } catch (error) {
      setMessage('An error occurred. Please try again. sgdfgfs');
      setVariant('danger');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm rounded-4">
            <h3 className="mb-4 text-center">Forgot Password</h3>
            {message && <Alert variant={variant}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button className="mt-3 w-100" type="submit" variant="success">
                Send Reset Link
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserForgotPassword;
