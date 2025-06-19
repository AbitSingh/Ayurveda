import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // <-- Import Link from react-router-dom

const AdminNavbar = () => {
  const logout = () => {
    console.log('Logout triggered');
     // Clear the cookie by setting its expiration to the past
  document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Redirect to /admin
  window.location.href = "/admin";
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" className="px-4 position-relative">
      <Container fluid className="d-flex align-items-center w-100">

        {/* Logo */}
        <Navbar.Brand as={Link} to="#">
          <Image
            id="logo-img"
            height="19"
            width="130"
            className="img-fluid auto_size"
            src="/images/Logo-2.jpg"
            alt="logo-image"
          />
        </Navbar.Brand>

        {/* Centered Links */}
        <Nav className="center-nav d-flex flex-row gap-4">

          <Nav.Item>
            <Nav.Link as={Link} to="/admin/AdminManagePage"><b>Manage Admin</b></Nav.Link>
          </Nav.Item>

          {/* Dropdown for Manage Category */}
          <NavDropdown title={<b>Manage Category & Sub-Category</b>} id="manageCategoryDropdown">
            <NavDropdown.Item as={Link} to="/admin/manageCategory">Manage Category</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/manageSubCategories">Manage Sub Category</NavDropdown.Item>
          </NavDropdown>

          <Nav.Item>
            <Nav.Link as={Link} to="/admin/manageProducts"><b>Manage Product</b></Nav.Link>
          </Nav.Item>

          {/* Dropdown for Manage Orders */}
          <NavDropdown title={<b>Manage Orders</b>} id="manageOrdersDropdown">
            <NavDropdown.Item as={Link} to="/admin/pendingOrders">Pending Orders</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/shippedOrders">Shipped Orders</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/deliveredOrders">Delivered Orders</NavDropdown.Item>
          </NavDropdown>

          <Nav.Item>
            <Nav.Link as={Link} to="/admin/seeAppointments"><b>Appointments</b></Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link as={Link} to="/admin/blogManagement"><b>Manage Blogs</b></Nav.Link>
          </Nav.Item>
          
        </Nav>

        {/* Logout Button aligned far right */}
        <Button variant="danger" className="ms-auto" id="logoutBtn" onClick={logout}>
          Logout
        </Button>

      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
