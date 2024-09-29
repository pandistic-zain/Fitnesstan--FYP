import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "./Supplements.module.css"; // Importing as a module

const SupplementsPage = () => {
  const supplement = {
    name: "Whey Protein Isolate",
    overview:
      "Whey Protein Isolate is a fast-digesting protein supplement popular among athletes and bodybuilders for muscle recovery and growth. It contains a high percentage of protein with minimal fats and carbohydrates, making it ideal for those seeking to increase lean muscle mass without gaining fat.",
    benefits: [
      "High-quality protein for muscle growth",
      "Low in carbs and fat",
      "Supports muscle recovery after workouts",
      "Easily digestible and fast-absorbing",
      "Helps with weight management",
    ],
    drawbacks: [
      "May cause digestive issues for lactose-intolerant individuals",
      "Relatively expensive compared to other protein sources",
      "Some products contain artificial sweeteners",
      "Not suitable for vegans",
      "Overuse may lead to kidney strain",
    ],
    imageUrl: "https://via.placeholder.com/150", // Provide a valid image URL
  };

  return (
    <Container fluid className={styles.supplementPage}>
      <Button className={styles.backHomeTop} href="/">
        Back to Home
      </Button>

      <h1 className={`text-center mt-4 ${styles.pageName}`}>
        Supplement Insights
      </h1>
      <hr className={styles.topDivider} />

      <Row className="mt-4">
        <Col>
            <h2 className={styles.supplementName}>{supplement.name}</h2>
            <p className={styles.overview}>{supplement.overview}</p>
        </Col>
      </Row>
      <Row className={`mt-1 ${styles.mainSection}`}>
        {/* Left Column: Benefits */}
        <Col className={styles.column}>
          <h3>Benefits</h3>
          <ul className={styles.benefitsList}>
            {supplement.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </Col>

        <Card className={styles.supplementCard}>
          <Card.Img
            variant="top"
            src={supplement.imageUrl}
            alt={supplement.name}
            className={styles.cardImage}
          />
        </Card>

        {/* Right Column: Drawbacks */}
        <Col className={styles.column}>
          <h3>Possible Drawbacks</h3>
          <ul className={styles.drawbacksList}>
            {supplement.drawbacks.map((drawback, index) => (
              <li key={index}>{drawback}</li>
            ))}
          </ul>
        </Col>
      </Row>

      <div className={`text-center mt-5 ${styles.bottomSection}`}>
        <Button href="/">Back to Home</Button>
      </div>

      <Button
        className={styles.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to Top
      </Button>
    </Container>
  );
};

export default SupplementsPage;
