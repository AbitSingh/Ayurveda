import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Form, Button, Table, Modal, Row, Col, Image,
} from 'react-bootstrap';
import axios from 'axios';

import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

function CategoryManagement() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [modalName, setModalName] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  const addCategory = async () => {
    const token = getCookie("userToken");
  
    if (!name || !icon) {
      toast.warn('Please fill in all fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('icon', icon);
  
    try {
      const res = await axios.post(`${server_url}/admin/addCategory`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log(res.data);
      getCategory();
      setName('');
      setIcon(null);
    } catch (error) {
      console.error("Error uploading category:", error.response?.data || error.message);
    }
  };

  const getCategory = async () => {
    var token = getCookie("userToken");
    let res = await fetch(`${server_url}/admin/getCategory`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res = await res.json();
    setCategories(res.record || []);
  };

  const deleteCategory = async (id) => {
    var token = getCookie("userToken");
    let res = await fetch(`${server_url}/admin/deleteCategory/` + id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res = await res.json();
    if (!res.error) {
      toast.success("✅ Category deleted successfully");
      getCategory();
    } else {
      toast.error("❌ " + res.message);
    }
  };

  const showDetailsInModal = (data) => {
    setModalName(data.name);
    setCategoryId(data.id);
    setShowModal(true);
  };

  const editAdminDetails = async () => {
    var token = getCookie("userToken");
    if (!modalName) {
      toast.warn('Please fill in all fields.');
      return;
    }

    let res = await fetch(`${server_url}/admin/updateCategory/` + categoryId, {
      method: 'PUT',
      body: JSON.stringify({ name: modalName }),
      headers: {
        'Content-Type': 'application/json',  
        Authorization: `Bearer ${token}`
      }
    });

    res = await res.json();
    if (!res.error) {
      toast.success("✅ Category updated successfully");
      getCategory();
    } else {
      toast.error("❌ " + res.message);
    }

    setShowModal(false);
  };

  return (
    <Container className="mt-5 p-4 shadow bg-white rounded">
      <h2 className="text-center mb-4">Category Management</h2>
      <hr />
      <Form>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label><i className="fas fa-tag me-2" />Category Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="icon" className="mb-3">
          <Form.Label><i className="fas fa-image me-2" />Icon Image:</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setIcon(e.target.files[0])}
            required
          />
        </Form.Group>

        <Button variant="success" onClick={addCategory}>
          <i className="fas fa-plus me-2" />Submit
        </Button>
      </Form>

      <Table striped bordered hover className="mt-5 text-center">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Icon</th>
            <th>Action</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((x) => (
            //console.log(x),
            <tr key={x.id}>
              <td>{x.name}</td>
              <td><Image src={`${server_url}${x.icon}`} width={80} height={80} className="rounded category-img" /></td>
              <td>
                <Button variant="danger" onClick={() => deleteCategory(x.id)}>
                  <i className="fas fa-trash me-2" />Delete
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => showDetailsInModal(x)}
                >
                  <i className="fas fa-edit me-2" />Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title><i className="fas fa-edit me-2" />Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Update Category Name"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            <i className="fas fa-times me-2" />Close
          </Button>
          <Button variant="success" onClick={editAdminDetails}>
            <i className="fas fa-save me-2" />Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CategoryManagement;
