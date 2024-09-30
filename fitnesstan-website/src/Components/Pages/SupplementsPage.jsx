import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "./Supplements.module.css"; // Importing as a module

const SupplementsPage = () => {
  const supplements = [
    {
      id: 1,
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
      imageUrl: "https://via.placeholder.com/150",
      detailedDescription: `
        Whey Protein Isolate is a high-quality protein derived from milk during the cheese-making process. 
        It undergoes a filtration process to remove fats and carbohydrates, resulting in a product that typically contains 
        over 90% protein. Due to its rapid absorption, it's often consumed immediately after workouts to aid muscle recovery 
        and promote growth. 

        Athletes and bodybuilders commonly utilize Whey Protein Isolate for its benefits, which include increased muscle 
        protein synthesis and improved recovery time. The amino acid profile of whey protein is also exceptional, as it 
        contains all essential amino acids, making it a complete protein source. 

        Additionally, whey protein can help with weight management. The high protein content can promote a feeling of 
        fullness, which may help reduce overall calorie intake. Many individuals have found success in using whey protein 
        as a part of their meal replacement or snack options.

        However, it's essential to note that while whey protein offers numerous benefits, it may not be suitable for 
        everyone. Individuals with lactose intolerance may experience digestive discomfort, as whey protein isolate 
        still contains small amounts of lactose. It’s advisable to consider alternative protein sources if this is a concern. 

        In summary, Whey Protein Isolate is a powerful supplement that can support muscle growth, recovery, and weight 
        management when integrated into a balanced diet and exercise program.
      `,
    },
    {
      id: 2,
      name: "Creatine Monohydrate",
      overview:
        "Creatine Monohydrate is a well-researched supplement known for improving athletic performance, particularly in high-intensity training and explosive activities.",
      benefits: [
        "Increases muscle mass and strength",
        "Enhances performance in high-intensity exercise",
        "Supports recovery after intense workouts",
        "Improves cognitive function",
        "May increase energy levels",
      ],
      drawbacks: [
        "Can cause water retention",
        "May lead to digestive discomfort in some individuals",
        "Long-term effects are not fully understood",
        "Not suitable for those with kidney issues",
        "Requires consistent use for best results",
      ],
      imageUrl: "https://via.placeholder.com/150",
      detailedDescription: `
        Creatine Monohydrate is a compound found naturally in the body, primarily in muscle cells. It helps 
        produce adenosine triphosphate (ATP), the primary energy carrier in the body, especially during short bursts of 
        intense physical activity. 

        Numerous studies have demonstrated that supplementing with creatine can significantly enhance strength and 
        muscle mass, making it one of the most popular and effective performance-enhancing supplements available. 
        Athletes involved in activities like weightlifting, sprinting, or sports requiring quick bursts of speed 
        often see remarkable improvements in performance.

        In addition to its benefits for physical performance, creatine has also been researched for its potential 
        cognitive benefits. Some studies suggest that creatine supplementation may improve memory and cognitive function, 
        particularly in individuals experiencing mental fatigue.

        While creatine is generally safe for most people, some may experience side effects such as water retention or 
        gastrointestinal discomfort. It's crucial to stay adequately hydrated while supplementing with creatine to mitigate 
        these effects.

        Overall, Creatine Monohydrate is a highly effective supplement for athletes and fitness enthusiasts looking to 
        improve their performance and achieve their fitness goals.
      `,
    },
    // Add more supplements as needed
  ];

  return (
    <Container fluid className={styles.supplementPage}>
      <Button className={styles.backHomeTop} href="/">
        Back to Home
      </Button>

      <h1 className={`text-center mt-4 ${styles.pageName}`}>
        Supplement Insights
      </h1>
      <div className={styles.sectionDivider}></div>

      {supplements.map((supplement) => (
        <React.Fragment key={supplement.id}>
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

            <Col md="auto"> {/* Centering the Card */}
              <Card className={styles.supplementCard}>
                <Card.Img
                  variant="top"
                  src={supplement.imageUrl}
                  alt={supplement.name}
                  className={styles.cardImage}
                />
              </Card>
            </Col>

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

          <Row className="mt-1">
            <Col className={styles.detailedDescription}>
              <h6>{supplement.detailedDescription}</h6>
            </Col>
          </Row>

          {/* Horizontal Divider */}
          <hr className={styles.featureDivider} />
        </React.Fragment>
      ))}

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
