import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';
import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

function DeliveredOrdersPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadDeliverOrders();
  }, []);

  async function loadDeliverOrders() {
    try {
      const res = await axios.get(`${server_url}/admin/getDeliverOrders`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { records } = res.data;

      if (!res.data.error) {
        setRecords(records);
      } else {
        console.log(res.data.message); // Important error visibility
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Replace below with <Navbar /> if you modularize the navbar */}
      {/* <Navbar /> */}

      <Container className="mt-5">
        <h1>Manage Delivered Orders</h1>
        <Table bordered striped className="mt-4">
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
            </tr>
          </thead>
          <tbody>
            {records.map((x) => (
              //console.log(x),
              <tr key={x._id}>
                <td>{x._id}</td>
                <td>{x.grand_total}</td>
                <td>{x.payment_mode}</td>
                <td>{x.order_status}</td>
                <td>{x.payment_status}</td>
                <td>{x.city}</td>
                <td>{x.address}</td>
                <td>{x.mobile}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default DeliveredOrdersPage;
