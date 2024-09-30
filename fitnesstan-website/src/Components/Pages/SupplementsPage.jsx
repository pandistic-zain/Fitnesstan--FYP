import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "./Supplements.module.css"; // Importing as a module

const SupplementsPage = () => {
  const supplements = [
    {
      id: 1,
      name: "Whey Protein Isolate",
      overview: `Whey Protein Isolate is a highly regarded protein supplement favored by athletes and bodybuilders for its role in muscle recovery and growth. It is derived from milk during the cheese-making process and undergoes a filtration process that removes fats and carbohydrates, resulting in a product that typically contains over 90% protein.
One of the main advantages of Whey Protein Isolate is its fast digestion rate, allowing for quick absorption into the bloodstream. This rapid absorption makes it an ideal choice for post-workout nutrition, as it provides the body with essential amino acids needed for muscle repair and growth. Many athletes consume it immediately after exercise to support muscle recovery and enhance protein synthesis.
In addition to its muscle-building properties, Whey Protein Isolate is low in carbohydrates and fats, making it suitable for those looking to increase their protein intake without adding excess calories. This characteristic is particularly beneficial for individuals focused on losing fat while maintaining or gaining lean muscle mass.
Furthermore, Whey Protein Isolate can aid in weight management. The high protein content helps promote feelings of fullness, which can lead to reduced calorie intake throughout the day. Many individuals incorporate Whey Protein Isolate into their meals or snacks to achieve their dietary goals.
However, it's important to consider that Whey Protein Isolate may not be suitable for everyone. Individuals who are lactose intolerant might experience digestive issues, as it still contains trace amounts of lactose. Additionally, some products on the market may contain artificial sweeteners or additives that could be undesirable for certain users.
In summary, Whey Protein Isolate is a potent supplement for those seeking to enhance muscle growth, recovery, and overall body composition. When used in conjunction with a balanced diet and exercise regimen, it can be a valuable addition to any fitness-oriented lifestyle.
      `,
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
      detailedDescription:`Whey Protein Isolate (WPI) is a premium protein supplement that has gained immense popularity among fitness enthusiasts, athletes, and bodybuilders. Derived from milk during the cheese-making process, WPI undergoes a rigorous filtration process that removes most fats and carbohydrates, resulting in a product that boasts a protein content of over 90%. This high level of purity makes Whey Protein Isolate an excellent choice for individuals looking to increase their protein intake without the excess calories that can come from fats and carbs. Its rapid digestibility is one of its standout features; WPI is absorbed quickly into the bloodstream, allowing for immediate availability of amino acids, which are the building blocks of muscle tissue. This makes it particularly beneficial for post-workout recovery, where quick replenishment of nutrients is crucial for muscle repair and growth.
The benefits of Whey Protein Isolate extend beyond just muscle recovery. Its rich amino acid profile, which includes all essential amino acids, makes it a complete protein source. This is particularly important for those engaged in intense training or athletic activities, as the body requires a sufficient amount of amino acids to facilitate muscle protein synthesis and recovery. Additionally, WPI has been shown to support immune function, improve body composition, and even aid in weight management. The high protein content helps promote satiety, making individuals feel fuller for longer periods and potentially reducing overall calorie intake. This characteristic can be advantageous for those looking to lose weight or maintain a healthy body composition.
Whey Protein Isolate is versatile and can easily be incorporated into various dietary plans. It can be consumed as a shake, mixed into smoothies, or added to foods like oatmeal, yogurt, and baked goods. This flexibility allows individuals to enhance their protein intake without drastically altering their diet. Moreover, WPI comes in a variety of flavors, making it a palatable option for those who might be put off by the taste of plain protein powders. However, it is essential to choose high-quality products with minimal additives and artificial sweeteners, as some brands may contain undesirable ingredients that could counteract the benefits of the protein itself.
While Whey Protein Isolate offers numerous advantages, it is important to note that it may not be suitable for everyone. Individuals with lactose intolerance might experience digestive discomfort, as WPI contains trace amounts of lactose. In such cases, plant-based protein sources or lactose-free protein powders may be more appropriate. Additionally, some products may have added ingredients that could cause allergic reactions in sensitive individuals. Therefore, it is crucial to read labels carefully and consult with a healthcare professional or nutritionist if there are any concerns about potential allergens or sensitivities.
In conclusion, Whey Protein Isolate is a powerful and effective protein supplement that can significantly contribute to muscle growth, recovery, and overall health. Its high protein content, rapid digestibility, and versatility make it an ideal choice for anyone looking to enhance their fitness journey. Whether used as a post-workout shake or a nutritious addition to meals, WPI can help individuals achieve their nutritional goals and improve their athletic performance. As with any supplement, it should be integrated into a well-balanced diet and healthy lifestyle for optimal results.`,
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
      detailedDescription:
        "Creatine Monohydrate is a compound found naturally in the body, primarily in muscle cells. It helps produce adenosine triphosphate (ATP), the primary energy carrier in the body, especially during short bursts of intense physical activity. Numerous studies have demonstrated that supplementing with creatine can significantly enhance strength and muscle mass... [Detailed description continues for 1500-2000 words].",
    },
    {
      id: 3,
      name: "BCAAs (Branched-Chain Amino Acids)",
      overview:
        "Branched-Chain Amino Acids (BCAAs) consist of three essential amino acids: leucine, isoleucine, and valine. They play a critical role in muscle protein synthesis, making them a popular supplement among athletes looking to boost recovery and muscle growth.",
      benefits: [
        "Enhances muscle protein synthesis",
        "Reduces muscle soreness",
        "Improves endurance and performance",
        "Prevents muscle breakdown",
        "Supports lean muscle mass growth",
      ],
      drawbacks: [
        "May cause gastrointestinal distress in some users",
        "Not effective without adequate dietary protein",
        "Can be expensive compared to other supplements",
        "Requires frequent supplementation for results",
        "Not necessary for those already consuming adequate protein",
      ],
      imageUrl: "https://via.placeholder.com/150",
      detailedDescription:
        "BCAAs are often consumed pre-, intra-, or post-workout to promote muscle recovery and reduce muscle soreness. These essential amino acids play a crucial role in muscle repair and growth. Leucine, one of the BCAAs, is particularly important for initiating muscle protein synthesis... [Detailed description continues for 1500-2000 words].",
    },
    {
      id: 4,
      name: "Omega-3 Fish Oil",
      overview:
        "Omega-3 Fish Oil is rich in essential fatty acids, primarily EPA and DHA, which provide numerous health benefits, including improved heart health, reduced inflammation, and enhanced brain function. This supplement is popular among athletes for its joint support and recovery-enhancing properties.",
      benefits: [
        "Reduces inflammation",
        "Supports heart health",
        "Improves cognitive function",
        "Promotes joint health",
        "Enhances recovery after intense exercise",
      ],
      drawbacks: [
        "Can cause fishy aftertaste or burps",
        "May interact with blood-thinning medications",
        "High doses can cause digestive upset",
        "Quality varies between products",
        "Requires consistent use for noticeable benefits",
      ],
      imageUrl: "https://via.placeholder.com/150",
      detailedDescription:
        "Omega-3 Fish Oil contains two essential fatty acids: EPA and DHA, which have numerous benefits for overall health. Athletes often use fish oil to support joint health and reduce inflammation caused by intense training... [Detailed description continues for 1500-2000 words].",
    },
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
              <p className={styles.overview}>
                {supplement.overview.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
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

            <Col md="auto">
              {" "}
              {/* Centering the Card */}
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
          {supplement.detailedDescription.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
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
