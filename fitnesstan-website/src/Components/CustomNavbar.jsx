import React from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../Assets/Fitnesstan.png";
import "./Navbar.css";

const CustomNavbar = () => {
  const location = useLocation();

  const handleFeaturesClick = (e) => {
    if (location.pathname === "/") {
      // Scroll to the Features section if on the homepage
      e.preventDefault();
      document
        .getElementById("features")
        .scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      // Scroll to the Features section if on the homepage
      e.preventDefault();
      document.getElementById("home").scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSupplementClick = (e) => {
    if (location.pathname === "/") {
      // Scroll to the Features section if on the homepage
      e.preventDefault();
      document
        .getElementById("supplements")
        .scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleTestimonialsClick = (e) => {
    if (location.pathname === "/") {
      // Scroll to the Features section if on the homepage
      e.preventDefault();
      document
        .getElementById("testimonials")
        .scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleContactClick = (e) => {
    if (location.pathname === "/") {
      // Scroll to the Features section if on the homepage
      e.preventDefault();
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    }
  };
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
      {location.pathname === "/" && (
      <div className="links-section ">
        <Container>
          <Nav className="justify-content-center">
            <Nav.Link
              as={location.pathname === "/" ? Link : NavLink}
              to={location.pathname === "/" ? "#home" : "/home"}
              activeClassName="active"
              onClick={handleHomeClick}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={location.pathname === "/" ? Link : NavLink}
              to={location.pathname === "/" ? "#features" : "/features"}
              activeClassName="active"
              onClick={handleFeaturesClick}
            >
              Features
            </Nav.Link>
            <Nav.Link
              as={location.pathname === "/" ? Link : NavLink}
              to={location.pathname === "/" ? "#supplements" : "/supplements"}
              activeClassName="active"
              onClick={handleSupplementClick}
            >
              Supplements
            </Nav.Link>
            <Nav.Link
              as={location.pathname === "/" ? Link : NavLink}
              to={location.pathname === "/" ? "#testimonials" : "/testimonials"}
              activeClassName="active"
              onClick={handleTestimonialsClick}
            >
              Feedbacks
            </Nav.Link>
            <Nav.Link
              as={location.pathname === "/" ? Link : NavLink}
              to={location.pathname === "/" ? "#contact" : "/contact"}
              activeClassName="active"
              onClick={handleContactClick}
            >
              Contact Us
            </Nav.Link>
          </Nav>
        </Container>
      </div>
        )}
    </>
  );
};
export default CustomNavbar;
