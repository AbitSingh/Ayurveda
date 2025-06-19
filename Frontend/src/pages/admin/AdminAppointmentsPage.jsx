import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './AppointmentsPage.css'; // Optional if you split custom styles
import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

function AppointmentsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    seeAppointments();
  }, []);

  // document.addEventListener('DOMContentLoaded', function() {
  //     seeAppointments();
  // });

  async function seeAppointments() {
    try {
      const res = await axios.get(`${server_url}/admin/seeAppointmentsData`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { records } = res.data;
      setRecords(records);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function approveAppointment(id) {
    const token = getCookie("userToken");
    try {
      const res = await axios.put(`${server_url}/admin/approveAppointment/${id}`, 
        {},
        {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log("Approve Appointment");
      console.log(res.data);
      console.log(res.data.error);

      if (res.data.error) {
        toast.warn(res.data.message);  
      } else {
        toast.success(res.data.message);
        console.log("****");
        seeAppointments();
        // alert(res.data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function disapproveAppointment(id) {
    const token = getCookie("userToken");
    try {
      const res = await axios.put(`${server_url}/admin/disapproveAppointment/${id}`, 
        {},
        {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!res.data.error) {
        console.log("See Appointment function");
        seeAppointments();
        toast.success(res.data.message);       
      } else {
        toast.warn(res.data.message); 
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Replace with your <Navbar /> component if modularized */}
      {/* <Navbar /> */}

      <Container className="mt-5">
        <h1 className="text-center mb-4">Appointment Status</h1>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Approve</th>
              <th>Disapprove</th>
            </tr>
          </thead>
          <tbody>
            {records.map((x) => (
              console.log(x),
              <tr key={x._id}>
                <td>{x._id}</td>
                <td>{x.name}</td>
                <td>{x.phone}</td>
                <td>{x.message}</td>
                <td>{x.subject}</td>
                <td>{x.createdAt}</td>
                <td>{x.status}</td>
                <td>
                  <Button variant="success" onClick={() => approveAppointment(x._id)}>
                    Approve
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => disapproveAppointment(x._id)}>
                    Disapprove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default AppointmentsPage;
