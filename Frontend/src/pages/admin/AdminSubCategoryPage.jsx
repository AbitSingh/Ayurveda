import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Modal,
} from 'react-bootstrap';
import axios from 'axios';
import {getCookie, server_url} from "../../utils/script.jsx";
import {toast} from "react-toastify";

function AdminSubCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [modalName, setModalName] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    getCategories();
    getSubCategoryData();
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(`${server_url}/admin/getCategories`);
      setCategories(res.data.records);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const saveSubCategoryPage = async () => {
    const token = getCookie("userToken");
    if (categoryId === '' || subCategory.trim() === '') {
      toast.warn('Please select all options');
      return;
    }

    try {
      const res = await axios.post(`${server_url}/admin/addSubCategory`, {
        subCategory,
        categoryId,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.data.error) {
        toast.success('Subcategory added successfully!');
        getSubCategoryData();
        setSubCategory('');
        setCategoryId('');
      } else if (res.data.error === 'duplicate') {
        toast.error('Subcategory already exists!');
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Something went wrong!');
    }
  };

  const getSubCategoryData = async () => {
    try {
      const res = await axios.get(`${server_url}/admin/getSubCategoryData`);
      setSubCategories(res.data.records);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const deleteSubCategory = async (id) => {
    const token = getCookie("userToken");
    try {
      const res = await axios.delete(`${server_url}/admin/deleteSubCategory/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.data.error) {
        toast.success('Sub-Category deleted Successfully!');
        getSubCategoryData();
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error.message);
      toast.error(error.message);
    }
  };

  const showDetailsInModal = (name, id) => {
    setModalName(name);
    setSubCategoryId(id);
    setShowModal(true);
  };

  const editAdminDetails = async () => {
    const token = getCookie("userToken");
    if (modalName.trim() === '') {
      toast.warn('Please enter subcategory name');
      return;
    }

    try {
      const res = await axios.put(`${server_url}/admin/updateSubCategory/${subCategoryId}`, {
        id: subCategoryId,
        name: modalName,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.data.error) {
        toast.success('Subcategory updated successfully!');
        getSubCategoryData();
        setShowModal(false);
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Container className="mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 className="text-center mb-3">Sub Category Page</h2>

      <Card className="shadow-lg">
        <Card.Body>
          <Form>
            {/* Category Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Open this select menu</option>

                {categories.map((x) => {
                  console.log("Rendering category:", x);
                  return (
                    // Yaha piche sai id e aa rahi hai not _id.
                    <option key={x.id} value={x.id}> 
                      {x.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            {/* Subcategory Input */}
            <Form.Group className="mt-5">
              <Form.Label htmlFor="subCategory">Sub Category Name</Form.Label>
              <Form.Control
                type="text"
                id="subCategory"
                placeholder="Enter subcategory name"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="success"
              className="mt-4"
              onClick={saveSubCategoryPage}
            >
              Submit
            </Button>

            {/* Subcategories Table */}
            <div className="mt-4">
              <Table bordered striped hover>
                <thead>
                  <tr>
                    <th>Sub Category Name</th>
                    <th>Category Name</th>
                    <th>Action</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  {subCategories.map((x, index) => (
                    // console.log(x),
                    <tr key={x._id}>
                      <td>{x.name}</td>
                      <td>{x.categoryId?.name || 'N/A'}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteSubCategory(x._id)}
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => showDetailsInModal(x.name, x._id)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>Update Sub Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="modalName">Name:</Form.Label>
            <Form.Control
              type="text"
              id="modalName"
              name="name"
              placeholder="Update Sub-Category Name"
              className="my-1"
              required
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            <i className="fas fa-times me-2"></i>Close
          </Button>
          <Button variant="success" onClick={editAdminDetails}>
            <i className="fas fa-save me-2"></i>Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminSubCategoryPage;
