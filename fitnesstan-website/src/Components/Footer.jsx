import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Footer.module.css'; // Importing CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row className={styles.footerRow}>
          <Col md={4}>
            <h5>About Fitnesstan</h5>
            <p>Your AI-powered fitness companion, offering personalized workout and diet plans while considering medical conditions. Start your fitness journey today!</p>
          </Col>

          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className={styles.contactInfo}>
              <li><FaMapMarkerAlt /> 123 Fitness Street, Lahore, Pakistan</li>
              <li><FaPhone /> +92 300 1234567</li>
              <li><FaEnvelope /> info@fitnesstan.com</li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>Certifications/Partners</h5>
            <p>We collaborate with top fitness organizations to provide the best services. <strong>Certified by XYZ Fitness Authority</strong></p>
          </Col>
        </Row>

        <hr className={styles.divider} />

        <Row className="text-center">
          <Col>
            <h5>Follow Us</h5>
            <div className={styles.iconContainer}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            </div>
            <p>&copy; {new Date().getFullYear()} Fitnesstan. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
