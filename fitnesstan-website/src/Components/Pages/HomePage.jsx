import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
// import { Link } from 'react-router-dom';
import workoutImage from "../../Assets/workout-image.jpg";
import nutrientImage from "../../Assets/nutrition-image.jpg";
import DiabetesDietImage from "../../Assets/diabetes-diet-image.jpg";
import SupplementsImage from "../../Assets/supplement-image.jpg";
import DataPrivacyImage from "../../Assets/data-privacy-image.jpg";
import ProgressTrackingImage from "../../Assets/progress-tracking-image.jpg";
import styles from "./Home.module.css"; // Custom CSS for styling
import {
  FaDumbbell,
  FaHeartbeat,
  FaAppleAlt,
  FaCapsules,
  FaLock,
  FaChartLine,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import headerImg from "../../Assets/header-image.png";

const HomePage = () => {
  const navigate = useNavigate();
  const handleExploreButtonClick = () => {
    navigate("/features");
  };
  return (
    <div className={styles["home-page"]}>
      {/* Hero Section */}
      <section className={styles["hero-section"]} id="home">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1>Welcome to Fitnesstan</h1>
              <p>
                Welcome to Fitnesstan, the app designed to transform your fitness
                goals into reality! Whether you're a beginner or a seasoned
                athlete, our platform offers tailored workout and diet plans
                crafted just for you.
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
          <h2 className={styles.sectionTitle}>Why Choose Fitnesstan?</h2>

          {/* Feature 1: Personalized Workouts */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src={workoutImage} alt="Personalized Workouts" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaDumbbell className={styles.featureIcon} />
                <h5>Personalized Workouts</h5>
                <p>
                  Experience AI-driven workout plans that consider your fitness
                  goals, medical conditions, and workout intensity. Our approach
                  incorporates a balanced push-pull mechanism to ensure optimal
                  muscle engagement and recovery for a well-rounded fitness
                  journey.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 2: Nutrient Plan */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src={nutrientImage} alt="Nutrient Plan" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaAppleAlt className={styles.featureIcon} />
                <h5>Nutrient Plan</h5>
                <p>
                  Choose your foods from our chart, and we'll calculate the
                  macronutrients and dietary needs. We'll then create a custom
                  meal plan tailored to your goals, ensuring both enjoyment and
                  optimal nutrition.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 3: Diabetes True Diet Plan */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img
                  src={DiabetesDietImage}
                  alt="Diabetes True Type Diet Plan"
                />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaHeartbeat className={styles.featureIcon} />
                <h5>Diabetes Diet Plans</h5>
                <p>
                  Our diet plans are specially designed for people with
                  diabetes. They help you manage your blood sugar while enjoying
                  tasty meals. Plus, we provide dietary supplements to ensure
                  you meet your macronutrient needs.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 4: Supplement Support Plan */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src={SupplementsImage} alt="Supplement Support Plan" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaCapsules className={styles.featureIcon} />
                <h5>Supplement Support Plan</h5>
                <p>
                  Our Supplement Support Plan provides AI-driven recommendations
                  for dietary supplements, approved by certified fitness
                  trainers. Enhance your health and optimize your performance
                  with expert-backed choices tailored to your fitness goals.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 5: Data Privacy */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src={DataPrivacyImage} alt="Data Privacy" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaLock className={styles.featureIcon} />
                <h5>Data Privacy</h5>
                <p>
                  We prioritize your data privacy, ensuring your information is
                  securely stored. Any use of your data will be done with your
                  explicit consent, respecting your preferences at all times.
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.horizontalDivider}></div>

          {/* Feature 6: Progress Tracking */}
          <Row className={styles.featureRow}>
            <Col md={5} className={styles.featureImageCol}>
              <div className={styles.featureImage}>
                <img src={ProgressTrackingImage} alt="Progress Tracking" />
              </div>
            </Col>
            <div className={styles.verticalDivider}></div>
            <Col md={5} className={styles.featureTextCol}>
              <div className={styles.featureCard}>
                <FaChartLine className={styles.featureIcon} />
                <h5>Progress Tracking</h5>
                <p>
                  Monitor your fitness journey with detailed weekly analytics.
                  Each plan will be reevaluated weekly to ensure it aligns with
                  your evolving goals and progress.
                </p>
              </div>
            </Col>
          </Row>
          <div
            className="button-container"
            style={{ textAlign: "center", margin: "40px 0" }}
          >
            <button
              className={styles.comicbutton}
              onClick={handleExploreButtonClick}
            >
              Learn More!
            </button>
          </div>
          <div className={styles.horizontalDividerFinal}></div>
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
      <section className={styles["testimonials-section"]} id="testimonials">
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
      <section className={styles["contact-section"]} id="contact">
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
      <section className={styles["give-feedback-section"]} id="give-feedback">
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
