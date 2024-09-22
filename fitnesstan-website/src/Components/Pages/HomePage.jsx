import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
// import { Link } from 'react-router-dom';
import styles from "./Home.module.css"; // Custom CSS for styling
import {
  FaDumbbell,
  FaHeartbeat,
  FaAppleAlt,
  FaCapsules,
  FaLock,
  FaChartLine,
} from "react-icons/fa";
import headerImg from "../../Assets/header-img.svg";

const HomePage = () => {
  return (
    <div className={styles["home-page"]}>
      {/* Hero Section */}
      <section className={styles["hero-section"]} id="home">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1>Welcome to Fitnesstan</h1>
              <p>
                Your personalized fitness journey starts here. Get tailored
                workout and diet plans just for you.
              </p>
              <button className={styles["learn-more"]}>
                <span className={styles["circle"]} aria-hidden="true">
                  <span
                    className={styles["icon"] + " " + styles["arrow"]}
                  ></span>
                </span>
                <span className={styles["button-text"]}>Register Now</span>
              </button>
            </Col>
            <Col lg={6}>
              <img src={headerImg} alt="Fitness Banner" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} id="features">
        <Container>
          <h2 className={styles.sectionTitle}>Why Choose Fitistan?</h2>

          {/* Feature 1: Personalized Workouts */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img
                  src="path/to/workout-image.jpg"
                  alt="Personalized Workouts"
                />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaDumbbell className={styles.featureIcon} />
                <h5>Personalized Workouts</h5>
                <p>
                  AI-powered workout plans tailored to your fitness goals and
                  medical conditions.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 2: Nutrient Plan */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src="path/to/nutrition-image.jpg" alt="Nutrient Plan" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaAppleAlt className={styles.featureIcon} />
                <h5>Nutrient Plan</h5>
                <p>
                  Custom meal plans and supplement suggestions based on your
                  dietary needs.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 3: Diabetes True Type Diet Plan */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img
                  src="path/to/diabetes-diet-image.jpg"
                  alt="Diabetes True Type Diet Plan"
                />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaHeartbeat className={styles.featureIcon} />
                <h5>Diabetes True Type Diet Plan</h5>
                <p>Specialized diet plans crafted for people with diabetes.</p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 4: Supplement Support Plan */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img
                  src="path/to/supplement-image.jpg"
                  alt="Supplement Support Plan"
                />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaCapsules className={styles.featureIcon} />
                <h5>Supplement Support Plan</h5>
                <p>
                  Expert recommendations on the best supplements for your
                  fitness journey.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 5: Data Privacy */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src="path/to/data-privacy-image.jpg" alt="Data Privacy" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaLock className={styles.featureIcon} />
                <h5>Data Privacy</h5>
                <p>
                  We ensure the highest standards of data privacy to safeguard
                  your information.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 6: Progress Tracking */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img
                  src="path/to/progress-tracking-image.jpg"
                  alt="Progress Tracking"
                />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaChartLine className={styles.featureIcon} />
                <h5>Progress Tracking</h5>
                <p>Track your fitness journey with detailed analytics.</p>
              </div>
            </Col>
          </Row>

          {/* Blurry Effect and Button */}
          <div className={styles.blurryEffect}>
            <button className={styles.detailButton}>
              Explore Detailed Features
            </button>
          </div>
        </Container>
      </section>

      {/* Supplement Section */}
      <section className={styles["supplement-section"]} id="supplements">
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
      <section className={styles["testimonials-section"]}  id="testimonials">

        <Container>
          <h2>What Our Users Say</h2>
          <Row>
            <Col md={4}>
              <div className={styles["testimonial-card"]}>
                <p>
                  "Fitnesstan helped me achieve my fitness goals faster than
                  ever!"
                </p>
                <h4>- User 1</h4>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles["testimonial-card"]}>
                <p>
                  "The personalized plans really made a difference in my daily
                  routine."
                </p>
                <h4>- User 2</h4>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles["testimonial-card"]}>
                <p>
                  "Highly recommend this app for anyone serious about fitness!"
                </p>
                <h4>- User 3</h4>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Contact Us Section */}
      <section className={styles["contact-section"]}  id="contact">

        <Container>
          <h2>Contact Us</h2>
          <form className={styles["contact-form"]}>
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
            <Button type="submit" className={styles["cta-button"]}>
              Send Message
            </Button>
          </form>
        </Container>
      </section>
      {/* Give Feedback Section */}
      <section className={styles["give-feedback-section"]}  id="give-feedback">

        <Container>
          <h2>Give Us Your Feedback</h2>
          <p>
            We value your feedback! Please share your thoughts about Fitnesstan.
          </p>
          <form className={styles["feedback-form"]}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback">Feedback</label>
              <textarea
                id="feedback"
                className="form-control"
                rows="4"
                placeholder="Your Feedback"
                required
              ></textarea>
            </div>
            <button type="submit" className={styles["submit-button"]}>
              Submit
            </button>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
