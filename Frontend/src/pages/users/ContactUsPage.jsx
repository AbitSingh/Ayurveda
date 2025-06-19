import React, { useState } from 'react';
import axios from 'axios';
import {toast} from "react-toastify";

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.id]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await axios.post('http://localhost:5000/user/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
      console.error('Form submission error:', error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <div className="text-center mb-4">
            <h2 className="fw-bold">Contact Us</h2>
            <p className="text-muted">We’d love to hear from you! Please fill out the form below.</p>
          </div>

          <div className="card shadow rounded-4 border-0">
            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name" 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com" 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject" 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea 
                    className="form-control" 
                    id="message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..." 
                    required
                  ></textarea>
                </div>

                {status && <p className="text-center text-success ">{status}</p>}

                <div className="d-grid">
                  <button type="submit" className="btn btn-success opacity-80 btn-lg rounded-pill">Send Message</button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;
