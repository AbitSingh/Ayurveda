import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";
import "./MyOrders.css"; 
import {server_url, getCookie} from "../../utils/script.jsx"; // Adjust the import path as necessary
import {toast} from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  // Remove invalid style object. Use external CSS or inline styles instead.

  useEffect(() => {
    loadMyOrders();
  }, []);

  const loadMyOrders = async () => {
    const token = getCookie("userToken");
    try {
      const res = await axios.get(`${server_url}/user/getMyOrders`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const { data } = res.data;

      if (!res.data.error) {
        setOrders(data);
      } else {
        toast.warn(res.data.message);
      }
    } catch (error) {
      console.error("Error loading orders:", error.message);
    }
  };

  return (
    <>
      {/* Replace below with your Navbar component */}
      {/* <UserNavbar /> */}

      <Container className="mt-5">
        <Table striped bordered hover responsive className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Grand Total</th>
              <th>Payment Mode</th>
              <th>Order Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((x, id) => (
                //console.log(x),
                <tr key={id}>
                  <td>{x._id}</td>
                  <td>{x.grand_total}</td>
                  <td>{x.payment_mode}</td>
                  <td>{x.order_status}</td>
                  <td>{x.payment_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      {/* Replace below with your Footer component */}
      {/* <Footer /> */}
    </>
  );
};

export default MyOrders;
