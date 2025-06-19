import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

const AdminLogin = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const Navigate = useNavigate();
  const adminLogin = async () => {
    try {
      
      const res = await fetch(`${server_url}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify({
          loginEmail,
          loginPassword,
        }),
      });

      const data = await res.json();
      var {token} = data;
      let duration = 60 * 60 * 24 *1; // 1 day cookie duration
      document.cookie = `userToken=${token}; max-age=${duration}; path=/;`;

      if (!data.error) {
      toast.success('✅ Admin Login successful');
       //window.location.href = 'http://localhost:5000/admin/adminHome';
       Navigate('/admin/AdminManagePage');
      } else {
       toast.error('❌ ' + data.message);
      }
    } catch (error) {
      toast.error('❌ Error logging in');
      console.error(error);
    }
  };

  return (
    <div style={styles.body}>
      <Container className="login-container" style={styles.loginContainer}>
        <h3 className="text-center mb-4">Admin Login</h3>
        <Form>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <a href="#" className="forgot-link text-primary my-3" style={styles.forgotLink}>
              Forgot Password?
            </a>
          </Form.Group>

          <Button type="button" className="btn-success w-100" onClick={adminLogin}>
            Login
          </Button>
        </Form>
      </Container>
    </div>
  );
};

// Inline CSS styles as defined in original HTML
const styles = {
  body: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    paddingTop: '60px',
  },
  loginContainer: {
    maxWidth: '400px',
    background: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)',
  },
  forgotLink: {
    fontSize: '14px',
    display: 'block',
    textAlign: 'right',
    marginTop: '-10px',
    marginBottom: '15px',
  },
};

export default AdminLogin;
