import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

function ShippedOrdersPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadShippedOrders();
  }, []);

  async function loadShippedOrders() {
    try {
      const res = await axios.get(`${server_url}/admin/getShippedOrders`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.data.error) {
        setRecords(res.data.records);
      } else {
        console.log(res.data.message); // Important for error tracing
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deliverNowOrder(orderId) {
    const token = getCookie("userToken");
    try {
      const res = await axios.put(`${server_url}/admin/deliverOrder/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.data.error) {
        toast.success(res.data.message);
        loadShippedOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <Container className="mt-5" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa' }}>
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
            <th>Deliver Now</th>
          </tr>
        </thead>
        <tbody>
          {records.map((x) => (
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
                <Button
                  variant="success"
                  onClick={() => deliverNowOrder(x._id)}
                >
                  Deliver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ShippedOrdersPage;
