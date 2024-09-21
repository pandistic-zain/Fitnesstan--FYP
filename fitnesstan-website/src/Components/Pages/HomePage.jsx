import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './Home.module.css';  // Custom CSS for styling
import headerImg from '../../Assets/header-img.svg';


const HomePage = () => {
  return (
    <div className={styles['home-page']}>
      {/* Hero Section */}
      <section className={styles['hero-section']}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1>Welcome to Fitnesstan</h1>
              <p>Your personalized fitness journey starts here. Get tailored workout and diet plans just for you.</p>
              <Button variant="primary" className={styles['cta-button']}>Get Started</Button>
            </Col>
            <Col lg={6}>
              <img src={headerImg} alt="Fitness Banner" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles['features-section']}>
        <Container>
          <h2>Our Features</h2>
          <Row>
            <Col md={4}>
              <div className={styles['feature-card']}>
                <h3>Custom Diet Plans</h3>
                <p>Get diet plans tailored to your goals and medical conditions like diabetes.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles['feature-card']}>
                <h3>Personalized Workouts</h3>
                <p>Workouts designed specifically for you based on your body type and fitness goals.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles['feature-card']}>
                <h3>AI-Powered</h3>
                <p>AI-driven recommendations for optimized fitness results and tracking.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Supplement Section */}
      <section className={styles['supplement-section']}>
        <Container>
          <h2>Supplements: Pros & Cons</h2>
          <Row>
            <Col md={6}>
              <h3>Benefits of Supplements</h3>
              <ul>
                <li>Supports muscle growth</li>
                <li>Improves workout performance</li>
                <li>Boosts recovery after training</li>
              </ul>
            </Col>
            <Col md={6}>
              <h3>Drawbacks of Supplements</h3>
              <ul>
                <li>Possible side effects</li>
                <li>Not a substitute for proper diet</li>
                <li>Needs proper research before consumption</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className={styles['testimonials-section']}>
        <Container>
          <h2>What Our Users Say</h2>
          <Row>
            <Col md={4}>
              <div className={styles['testimonial-card']}>
                <p>"Fitnesstan helped me achieve my fitness goals faster than ever!"</p>
                <h4>- User 1</h4>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles['testimonial-card']}>
                <p>"The personalized plans really made a difference in my daily routine."</p>
                <h4>- User 2</h4>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles['testimonial-card']}>
                <p>"Highly recommend this app for anyone serious about fitness!"</p>
                <h4>- User 3</h4>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
       {/* Contact Us Section */}
       <section className={styles['contact-section']}>
        <Container>
          <h2>Contact Us</h2>
          <form className={styles['contact-form']}>
            <Row>
              <Col md={6}>
                <input type="text" placeholder="Your Name" />
              </Col>
              <Col md={6}>
                <input type="email" placeholder="Your Email" />
              </Col>
            </Row>
            <Row>
              <Col>
                <textarea rows="4" placeholder="Your Message"></textarea>
              </Col>
            </Row>
            <Button type="submit" className={styles['cta-button']}>Send Message</Button>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
