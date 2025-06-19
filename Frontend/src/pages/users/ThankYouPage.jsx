import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {toast} from "react-toastify";

const ThankYouPage = () => {
  return (
    <>


      <Container className="thank-you-box my-5 text-center">
        <div className="thank-you-icon" style={thankYouIconStyle}>
          ✅
        </div>
        <h2 className="mt-3">Thank You for Your Order!</h2>
        <p className="text-muted">
          Your order has been placed successfully. A confirmation has been sent to your email.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-3">
            <Link to="/" className="btn btn-primary">Go Back to Home</Link>
            <Link to="/user/myOrders" className="btn btn-success">My Orders</Link>
        </div>

      </Container>


    </>
  );
};

const thankYouIconStyle = {
  marginTop: '50px',
  fontSize: '60px',
  color: '#28a745'
};

export default ThankYouPage;
