import React from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import logo from "../Assets/Fitnesstan.png";
import "./Navbar.css";

const CustomNavbar = () => {
  return (
    <>
      {/* Main Navbar */}
      <BootstrapNavbar
        bg="light"
        variant="light"
        expand="lg"
        className="main-navbar"
      >
        <Container>
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center"
          >
            {/* Uncomment if using logo */}
            <img src={logo} alt="Fitnesstan Logo" />
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse
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
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Secondary Links Section */}
      <div className="links-section ">
        <Container>
          <Nav className="justify-content-center">
            <Nav.Link as={NavLink} to="/" activeClassName="active">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/features" activeClassName="active">
              Features
            </Nav.Link>
            <Nav.Link as={NavLink} to="/supplements" activeClassName="active">
              Supplements
            </Nav.Link>
          </Nav>
        </Container>
      </div>
    </>
  );
};

export default CustomNavbar;
