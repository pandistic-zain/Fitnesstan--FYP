import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importing custom CSS

const NavBar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="custom-navbar" sticky="top">
      <Container>
        {/* Logo/Brand */}
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/path-to-your-logo/logo.png" 
            alt="Fitnesstan Logo" 
            className="navbar-logo"
          />
          Fitnesstan
        </Navbar.Brand>

        {/* Collapsible Menu */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Links with Pakistani Flag Colors */}
          <Nav className="ml-auto nav-links">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/features">
              Features
            </Nav.Link>
            <Nav.Link as={Link} to="/supplements">
              Supplements
            </Nav.Link>

            {/* Login/Sign Up buttons */}
            <Button as={Link} to="/login" className="mx-2" variant="outline-primary">
              Login
            </Button>
            <Button as={Link} to="/signup" variant="primary">
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
