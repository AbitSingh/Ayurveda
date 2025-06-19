import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Button, Modal, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

function OrdersPage() {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    try {
      const res = await axios.get(`${server_url}/admin/getPendingOrders`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.data.error) {
        setRecords(res.data.records);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const shipNowOrder = async (id) => {
    const token = getCookie("userToken");
    try {
      const res = await axios.put(`${server_url}/admin/shipNowOrder/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.data.error) {
        toast.success("✅ " + res.data.message);
        loadPendingOrders();
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const showDetailsInModel = async (id) => {
    try {
      const res = await axios.get(`${server_url}/admin/getOrderDetails/${id}`);

      if (!res.data.error) {
        console.log("Response: ", res);
        setOrderDetails(res.data.data);
        setShowModal(true);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Container className="mt-5" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa' }}>
      {/* Orders Table */}
      <Table bordered striped>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Grand Total</th>
            <th>Payment Mode</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>City</th>
            <th>Address</th>
            <th>Mobile</th>
            <th>Ship Now</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          
          {records.map((x) => (
            console.log(x),
            <tr key={x._id}>
              <td>{x._id}</td>
              <td>{x.grand_total}</td>
              <td>{x.payment_mode}</td>
              <td>{x.order_status}</td>
              <td>{x.payment_status}</td>
              <td>{x.city}</td>
              <td>{x.address}</td>
              <td>{x.mobile}</td>
              <td>
                <Button variant="success" onClick={() => shipNowOrder(x._id)}>
                  Ship Now
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => showDetailsInModel(x._id)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Order Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>View Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered striped hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Photo</th>
                <th>Quantity</th>
                <th>Old Price</th>
                <th>New Price</th>
                <th>Order Id</th>
                <th>Discount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((x, idx) => (
                console.log("Response: ",x),
                <tr key={idx}>
                  <td>{x.productId?.name || 'N/A'}</td>
                  <td>
                    <Image
                      src={`${server_url}${x.productId?.photo || 'N/A'}`}
                      alt="Product"
                      width={50}
                      height={50}
                      rounded
                    />
                  </td>
                  <td>{x.quantity}</td>
                  <td>{x.oldPrice}</td>
                  <td>{x.newPrice}</td>
                  <td>{x.orderId}</td>
                  <td>{x.discount}</td>
                  <td>{x.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            <i className="fas fa-times me-2"></i>Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default OrdersPage;
