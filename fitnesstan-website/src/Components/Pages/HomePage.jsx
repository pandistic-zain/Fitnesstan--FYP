import { React, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
import headerImg from "../../Assets/header-img.png";
import ZainImg from "../../Assets/zain.jpg";
import UbaidImg from "../../Assets/ubaid.png";
import HuzaifaImg from "../../Assets/huzaifa.png";

const supplementsData = [
  {
    name: "MyProtein Impact Whey Protein",
    overview:
      "MyProtein Impact Whey Protein is a premium quality protein supplement designed to aid muscle growth and recovery.",
    benefits: [
      "Supports muscle growth by providing a high-quality source of protein with essential amino acids.",
      "Improves workout performance by delivering nutrients crucial for energy and endurance.",
      "Boosts recovery after training, enabling quicker return to high-intensity workouts.",
    ],
    drawbacks: [
      "Possible side effects include mild digestive discomfort for some users.",
      "Not a substitute for a well-balanced diet and should complement overall nutrition.",
      "Should be researched thoroughly before consumption to understand proper dosages.",
    ],
  },
  {
    name: "MuscleTech Creatine",
    overview:
      "MuscleTech Creatine is known for enhancing strength and high-intensity performance.",
    benefits: [
      "Increases muscle mass by promoting water retention in muscle cells.",
      "Improves strength by replenishing ATP levels during workouts.",
      "Enhances recovery by reducing muscle cell damage.",
    ],
    drawbacks: [
      "May cause digestive issues, particularly when taken in high doses.",
      "Requires proper hydration to prevent cramping and dehydration.",
      "Can lead to weight gain due to increased water retention.",
    ],
  },
  {
    name: "BSN BCAA (Branched-Chain Amino Acids)",
    overview:
      "BSN BCAAs are essential nutrients that the body obtains from proteins found in food.",
    benefits: [
      "Reduces muscle soreness and fatigue during intense workouts.",
      "Supports muscle recovery by decreasing muscle protein breakdown.",
      "Helps preserve lean muscle mass during calorie-restricted diets.",
    ],
    drawbacks: [
      "May not provide additional benefits if protein intake is already sufficient.",
      "Can cause gastrointestinal discomfort in some users.",
      "Possible interactions with certain medications, so consulting a doctor is advised.",
    ],
  },
  {
    name: "Optimum Nutrition Serious Mass",
    overview:
      "Optimum Nutrition Serious Mass is a high-calorie mass gainer designed to help individuals gain weight and muscle mass.",
    benefits: [
      "Provides 1,250 calories per serving to support rapid weight gain.",
      "Includes a blend of proteins and carbohydrates to fuel workouts and recovery.",
      "Fortified with vitamins and minerals to support overall health during bulking.",
    ],
    drawbacks: [
      "May cause digestive discomfort if consumed too quickly or in large quantities.",
      "High calorie content can lead to unwanted fat gain if not managed properly.",
      "Some users may find the taste too sweet or artificial.",
    ],
  },
];
const testimonialsData = [
  {
    message: "Fitnesstan helped me achieve my fitness goals faster than ever!",
    author: "Sarah Johnson",
  },
  {
    message:
      "The personalized plans really made a difference in my daily routine.",
    author: "Michael Smith",
  },
  {
    message: "Highly recommend this app for anyone serious about fitness!",
    author: "Emily Davis",
  },
  {
    message: "A fantastic app with amazing AI trainers. I'm so impressed!",
    author: "James Brown",
  },
  {
    message: "The nutrition and workout plans are exactly what I needed!",
    author: "Jessica Wilson",
  },
  {
    message:
      "The nutrition advice has completely changed my eating habits! I never realized how important it was to balance my macros until I started following the personalized plan. Now I feel more energized, and my cravings have significantly decreased. It's amazing how the right guidance can lead to such positive changes in my life!",
    author: "Zain Ul Abdeen",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const handleExploreButtonClick = () => {
    navigate("/features");
    scrollTop();
  };
  const handleLearnButtonClick = () => {
    navigate("/supplements");
    scrollTop();
  };
  const handleRegisterRedirect = () => {
    navigate("/register");
    scrollTop();
  };
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // eslint-disable-next-line no-unused-vars
  const [currentSupplement, setCurrentSupplement] = useState(
    supplementsData[0]
  );
  // eslint-disable-next-line no-unused-vars
  const [testimonials, setTestimonials] = useState(testimonialsData);
  return (
    <div className={styles["home-page"]}>
      {/* Hero Section */}
      <section className={styles["hero-section"]} id="home">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1>Welcome to Fitnessstan</h1>
              <p>
                Welcome to Fitnessstan, the app designed to transform your
                fitness goals into reality! Whether you're a beginner or a
                seasoned athlete, our platform offers tailored workout and diet
                plans crafted just for you.
              </p>
              <button
                className={styles["learn-more"]}
                onClick={handleRegisterRedirect}
              >
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
              Explore More!
            </button>
          </div>
          <div className={styles.horizontalDividerFinal}></div>
        </Container>
      </section>

      {/* Supplement Section */}
      <section className={styles["supplement-section"]} id="supplements">
        <Container>
          <h1 className={styles["section-title"]}>"Targeted Supplements"</h1>
          <hr className={styles["divider"]} />

          {supplementsData.map((supplement, index) => (
            <div key={index}>
              <h4>{supplement.name}</h4> {/* Supplement name */}
              <h6>{supplement.overview}</h6> {/* Supplement overview */}
              <Row>
                <Col md={6}>
                  <div className={styles["book"]}>
                    <ul>
                      {supplement.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                    <div className={styles["cover"]}>
                      <p>Benefits of {supplement.name}</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles["book"]}>
                    <ul>
                      {supplement.drawbacks.map((drawback, index) => (
                        <li key={index}>{drawback}</li>
                      ))}
                    </ul>
                    <div className={styles["cover"]}>
                      <p>Drawbacks of {supplement.name}</p>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className={styles["divider"]} />
            </div>
          ))}
          <div
            className="supplement-button-container"
            style={{ textAlign: "center", margin: "40px 0" }}
          >
            <button
              className={styles.supplementcomicbutton}
              onClick={handleLearnButtonClick}
            >
              Explore More!
            </button>
          </div>
          <div className={styles.horizontalDividerFinalSupplements}></div>
        </Container>
      </section>
      {/* testimonials Section */}
      <section className={styles.testimonialsSection} id="testimonials">
        <h2 className={styles.sectionTitle}>What Our Users Say !!!</h2>
        <div className={styles.testimonialRow}>
          {testimonialsData.map((testimonial, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.bg}></div>
              <div className={styles.blob}></div>
              <p className={styles.testimonialText}>{testimonial.message}</p>
              <p className={styles.testimonialAuthor}>- {testimonial.author}</p>
            </div>
          ))}
        </div>
        <div className={styles.horizontalDividerFinalfeedback}></div>
      </section>
      {/* Team Section */}
      <section className={styles["team-section"]} id="team">
        <Container>
          <h2>Meet Our Team</h2>
          <Row className={styles["team-row"]}>
            {/* Team Member 1 */}
            <Col md={4} className={styles["team-member"]}>
              <div className={styles["team-photo"]}>
                <img src={UbaidImg} alt="Team Member 1" />
              </div>
              <h3>Ubaid Ullah</h3>
              <p>- ML Engineer</p>
            </Col>

            {/* Team Member 2 */}
            <Col md={4} className={styles["team-member"]}>
              <div className={styles["team-photo"]}>
                <img src={ZainImg} alt="Team Member 2" />
              </div>
              <h3>Zain Ul Abdeen</h3>
              <p>- Team Lead</p>
              <p>- Java Web Developer</p>
            </Col>

            {/* Team Member 3 */}
            <Col md={4} className={styles["team-member"]}>
              <div className={styles["team-photo"]}>
                <img src={HuzaifaImg} alt="Team Member 3" />
              </div>
              <h3>Huzaifa Khan</h3>
              <p>- App Developer</p>
            </Col>
          </Row>
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
