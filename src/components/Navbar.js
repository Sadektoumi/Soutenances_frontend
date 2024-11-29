import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import authService from "../services/authService";
import "./NavBar.css"; // Ensure you have the custom CSS file

const CustomNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/"); // Redirect to login page
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Navbar.Brand href="/dashboard2">Admin Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto ">
          <NavDropdown
            title={<span className="text-white float-right">Profile</span>}
            id="basic-nav-dropdown"
            className="dropdown-menu-left"
          >
            <NavDropdown.Item
              alignRight
              onClick={() => navigate("/edit-profile")}
              className="text-dark"
            >
              <FaUserEdit className="mr-2" /> Edit Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout} className="text-dark">
              <FaSignOutAlt className="mr-2" /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
