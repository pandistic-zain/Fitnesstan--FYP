import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.svg";
import "./Navbar.css"; // Custom CSS for styling

const NavBar = () => {
  return (
    <>
      {/* Main Navbar */}
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        sticky="top"
        className="main-navbar"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            {/* <img
          src={logo}
          alt="Fitnesstan Logo"
          style={{ height: '50px', marginRight: '10px' }} // Adjust the size as needed
        /> */}
            Fitnesstan
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Link to="/register" className="button" data-text="Awesome">
                <span className="actual-text">&nbsp;Sign Up&nbsp;</span>
                <span aria-hidden="true" className="hover-text">
                  &nbsp;Login&nbsp;
                </span>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Secondary Links Section */}
      <div className="links-section">
        <Container>
          <Nav className="justify-content-center">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/features">
              Features
            </Nav.Link>
            <Nav.Link as={Link} to="/supplements">
              Supplements
            </Nav.Link>
          </Nav>
        </Container>
      </div>
    </>
  );
};

export default NavBar;
