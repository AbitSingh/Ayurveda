import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Table, Button, Form, Modal
} from "react-bootstrap";
import {toast} from "react-toastify";
import {getCookie, server_url} from "../../utils/script.jsx";

function AdminManagePage() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminType: ""
  });

  const [modalData, setModalData] = useState({
    _id: "",
    name: "",
    email: "",
    type: ""
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    readAdminData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  async function addAdmin() {
    var token = getCookie("userToken");
    try {
      const res = await axios.post(`${server_url}/admin/addAdmin`, formData,{
        headers: {Authorization: `Bearer ${token}`}
      });
      const data = res.data;
      if (!data.error) {
        toast.success("✅ Admin added successfully");
        setFormData({ adminName: "", adminEmail: "", adminPassword: "", adminType: "" });
        readAdminData();
      } else {
        toast.error("❌ " + data.message);
      }
    } catch (error) {
      toast.error("❌ Error: " + error.message);
    }
  }

  async function readAdminData() {
    var token = getCookie("userToken");
    try {
      const res = await axios.get(`${server_url}/admin/readAdminData`,{
        headers: {Authorization: `Bearer ${token}`}
      });
      const data = res.data;
      if (!data.error) {
        setAdmins(data.record);
      }
    } catch (error) {
      toast.error("❌ Error fetching admin data: " + error.message);
    }
  }

  async function deleteAdmin(id) {
    var token = getCookie("userToken");
    console.log("Token: ", token); // check what is being passed
    console.log("Deleting admin with ID:", id); // check what is being passed

    if (!id) {
     toast.error("❌ No ID provided for deletion");
      return;
    }
    try {
      const res = await axios.delete(`${server_url}/admin/deleteAdmin/${id}`,
        {
          headers: {Authorization: `Bearer ${token}`}
        }
      );
      const data = res.data;
    
      if (!data.error) {
        toast.success("✅ Admin deleted successfully");
        readAdminData();
      } else {
       toast.error("❌ " + data.message);
      }
    } catch (error) {
     toast.error("❌ Error deleting admin: " + error.message);
    }
  }
  

  async function editAdminDetails() {
    var token = getCookie("userToken");
    try {
      const res = await axios.put(`${server_url}/admin/updateAdmin/${modalData._id}`, modalData,{
        headers: {Authorization: `Bearer ${token}`}
      });
      const data = res.data;
      if (!data.error) {
       toast.success("✅ Admin updated successfully");
        readAdminData();
      } else {
       toast.error("❌ " + data.message);
      }
    } catch (error) {
      toast.error("❌ Error updating admin: " + error.message);
    }
  }

  function showDetailsInModal(admin) {
    setModalData(admin);
    setShowModal(true);
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center">Admin Manage Page</h2>
      <hr />
      <h4>Add Admin</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Admin Name</Form.Label>
          <Form.Control
            type="text"
            name="adminName"
            value={formData.adminName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Admin Email</Form.Label>
          <Form.Control
            type="email"
            name="adminEmail"
            value={formData.adminEmail}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Admin Password</Form.Label>
          <Form.Control
            type="password"
            name="adminPassword"
            value={formData.adminPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Select name="adminType" value={formData.adminType} onChange={handleChange} required>
            <option value="">Admin Type</option>
            <option value="Admin">Admin</option>
            <option value="SubAdmin">Sub-Admin</option>
          </Form.Select>
        </Form.Group>

        <Button variant="success" onClick={addAdmin}>Add Admin</Button>
      </Form>

      <h4 className="mt-5">Admin Table</h4>
      <Table bordered striped hover>
        <thead>
          <tr>
            <th>Admin Name</th>
            <th>Admin Email</th>
            <th>Admin Type</th>
            <th>Action</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.type}</td>
              <td>
                <Button variant="danger" type="button" onClick={() => deleteAdmin(admin._id)}>Delete</Button>
              </td>
              <td>
                <Button variant="warning" onClick={() => showDetailsInModal(admin)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control type="hidden" value={modalData._id} />
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={modalData.name}
                onChange={handleModalChange}
                placeholder="Update Admin Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={modalData.email}
                onChange={handleModalChange}
                placeholder="Update Admin Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={modalData.type}
                onChange={handleModalChange}
                placeholder="Update Admin Type"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="success" onClick={() => { editAdminDetails(); setShowModal(false); }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminManagePage;
