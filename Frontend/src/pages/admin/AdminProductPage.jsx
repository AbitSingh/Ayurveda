import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Modal,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import {toast} from "react-toastify";
import {getCookie, server_url} from "../../utils/script.jsx";

const ManageProducts = () => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    categoryId: '',
    subcategoryId: '',
    icon: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    discount: '',
  });

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, icon: e.target.files[0] }));
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${server_url}/admin/getCategories`);
      if (!res.data.error) {
        setCategories(res.data.records);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSubcategory = async (categoryId) => {
    setFormData((prev) => ({ ...prev, categoryId, subcategoryId: '' }));
    setSubcategories([]);
    if (!categoryId) return;
    try {
      const res = await axios.get(`${server_url}/admin/getSubcategories?categoryId=${categoryId}`);
      if (!res.data.error) {
        setSubcategories(res.data.record);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
     toast.error("Something went wrong.");
    }
  };

  const saveProduct = async () => {
    const token = getCookie("userToken");
    const { name, description, price, discount, categoryId, subcategoryId, icon } = formData;
  
    if (!name || !description || !price || !discount || !categoryId || !subcategoryId || !icon) {
     toast.warn('Please fill in all fields.');
      return;
    }
  
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("price", price);
    data.append("discount", discount);
    data.append("categoryId", categoryId);
    data.append("subcategoryId", subcategoryId);
    data.append("icon", icon);  // file
  
    try {
      const res = await axios.post(`${server_url}/admin/addProduct`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      toast.success(res.data.message);
      if (!res.data.error) {
        setFormData({
          name: '',
          description: '',
          price: '',
          discount: '',
          categoryId: '',
          subcategoryId: '',
          icon: null
        });
        getProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product.");
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`${server_url}/admin/getProducts`);
      if (!res.data.error) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
     const token = getCookie("userToken");
    try {
      const res = await axios.delete(`${server_url}/admin/deleteProduct/${id}`,{
        headers: {
          Authorization: `Bearer ${getCookie("userToken")}`
        }
      });
      toast.success(res.data.message);
      if (!res.data.error) getProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  const showDetailsInModel = (data) => {
    setUpdateData({
      id: data._id,
      name: data.name,
      description: data.description,
      price: data.price,
      discount: data.discount,
    });
    setShowModal(true);
  };

  const editProductDetails = async () => {
     const token = getCookie("userToken");
    const { id, name, description, price, discount } = updateData;
    try {
      const res = await axios.put(`${server_url}/admin/updateProduct/${id}`, {
        name,
        description,
        price,
        discount,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(res.data.message);
      if (!res.data.error) getProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    }
    setShowModal(false);
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg rounded">
        <Card.Body>
          <h2 className="text-center mt-3"><b>Manage Products</b></h2>
          <Form encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control type="number" max="100" min="0" name="discount" value={formData.discount} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={formData.categoryId} onChange={(e) => getSubcategory(e.target.value)} name="categoryId">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sub Category</Form.Label>
                  <Form.Select name="subcategoryId" value={formData.subcategoryId} onChange={handleInputChange}>
                    <option value="">Select Sub Category</option>
                    {subcategories.map((sub) => (
                      //console.log("Rendering Sub"),
                      //console.log(sub),
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Icon Image</Form.Label>
                  <Form.Control type="file" name="icon" onChange={handleFileChange} accept="image/*" required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
            </Form.Group>

            <div className="text-center m-5">
              <Button variant="success" className="px-4 py-2" onClick={saveProduct}>Add Product</Button>
            </div>
          </Form>

          <Table striped bordered hover className="mt-5">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Description</th>
                <th>Photo</th>
                <th>Price (₹)</th>
                <th>Discount (%)</th>
                <th>Sub Category</th>
                <th>Action</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(records) && records.length > 0 ? records.map((x) => (
                console.log(`${server_url}${x.photo}`),
                //console.log("Product", x),
                <tr key={x.id}>
                  <td>{x.name}</td>
                  <td>{x.description}</td>
                 
                  <td><Image src={`${server_url}${x.photo}`} alt="Product-img" style={{ width: 130, height: 150 }} thumbnail /></td>
                  <td>{x.price}</td>
                  <td>{x.discount}</td>
                  <td>{x.subcategoryId?.name}</td>
                  <td><Button variant="danger" onClick={() => deleteProduct(x._id)}>Delete</Button></td>
                  <td><Button variant="warning" onClick={() => showDetailsInModel(x)}>Edit</Button></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center">No products found</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={updateData.name} onChange={(e) => setUpdateData(prev => ({ ...prev, name: e.target.value }))} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={updateData.description} onChange={(e) => setUpdateData(prev => ({ ...prev, description: e.target.value }))} rows={3} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" min="0" name="price" value={updateData.price} onChange={(e) => setUpdateData(prev => ({ ...prev, price: e.target.value }))} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Discount</Form.Label>
                <Form.Control type="number" min="0" max="100" name="discount" value={updateData.discount} onChange={(e) => setUpdateData(prev => ({ ...prev, discount: e.target.value }))} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowModal(false)}>Close</Button>
              <Button variant="success" onClick={editProductDetails}>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageProducts;
