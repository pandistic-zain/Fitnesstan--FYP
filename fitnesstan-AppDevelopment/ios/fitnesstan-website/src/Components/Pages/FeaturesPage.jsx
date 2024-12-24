import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./Features.module.css";

// Placeholder images and icons
import {
  FaDumbbell,
  FaAppleAlt,
  FaHeartbeat,
  FaCapsules,
  FaLock,
  FaChartLine,
} from "react-icons/fa";
import workoutImage from "../../Assets/workout-image.jpg"; // Replace with your actual image paths
import nutrientImage from "../../Assets/nutrition-image.jpg";
import diabetesDietImage from "../../Assets/diabetes-diet-image.jpg";
import supplementsImage from "../../Assets/supplement-image.jpg";
import dataPrivacyImage from "../../Assets/data-privacy-image.jpg";
import progressTrackingImage from "../../Assets/progress-tracking-image.jpg";

const featureDetails = [
  {
    id: "1",
    title: "Personalized Workouts",
    description:
      "Our AI-driven workout plans are meticulously crafted by fitness experts, considering not only your fitness level but also your age, goals, previous injuries, and any medical conditions. Whether you're aiming to lose weight, build muscle, or improve your cardiovascular endurance, each plan is designed to adapt to your progress. You’ll receive exercises that challenge but never overwhelm you, ensuring consistent growth and minimal risk of injury. Our system tracks your performance metrics, suggesting adjustments in intensity, volume, and rest periods. You can also switch between different training methodologies such as strength training, HIIT, functional fitness, or endurance training, giving you endless variety and preventing burnout. And not only that, but each workout session is complemented by real-time feedback, allowing you to modify your form, improve your technique, and avoid injury. Our system also integrates wearables and tracks your heart rate variability, VO2 max, and muscle activation levels to ensure that your workouts are not only effective but scientifically optimized. You’ll also get access to an expansive library of instructional videos, led by certified trainers, offering you guidance on every exercise, ensuring you perform every movement correctly and efficiently. With our mobile app, you can monitor your recovery, track your sleep patterns, and adjust your training load based on readiness scores. Our aim is to create a holistic fitness experience that doesn’t just push you to the limit but helps you thrive sustainably.",
    icon: <FaDumbbell className={styles.featureIcon} />,
    image: workoutImage,
  },
  {
    id: "2",
    title: "Nutrient Plan",
    description:
      "The AI-generated nutrient plan takes into account not only your dietary restrictions—be it vegetarian, vegan, gluten-free, or keto—but also your macronutrient and micronutrient needs based on your goals. Whether you're bulking, cutting, or maintaining, our system crafts a meal plan that prioritizes whole foods, healthy fats, lean proteins, and complex carbs. Each day of your plan is designed with precise calorie counts to help you meet your goals while ensuring that you don’t miss out on essential vitamins and minerals. You’ll receive detailed recipes, portion sizes, and even meal prep instructions. The plan also includes recommendations for hydration and how to balance electrolytes. There's a smart adjustment feature that changes your plan dynamically based on your progress. Additionally, we’ll provide snack options and recommendations for energy-boosting drinks that enhance your performance during workouts. Our system is flexible enough to adapt to last-minute changes, like an unplanned dining-out event or food allergies you might develop over time. It also keeps track of seasonal produce availability, ensuring you always have access to fresh ingredients. Moreover, the plan analyzes your food preferences over time and starts offering meal suggestions based on your favorite ingredients while still meeting your nutritional needs. With integration into popular food tracking apps, you can also scan barcodes of food items to instantly add them to your daily log, which will automatically adjust the nutrient and calorie calculations for you.",
    icon: <FaAppleAlt className={styles.featureIcon} />,
    image: nutrientImage,
  },
  {
    id: "3",
    title: "Diabetes Diet Plans",
    description:
      "Our diabetes-friendly diet plans are based on cutting-edge research in blood sugar management. These plans are not just about eliminating sugar; they provide a balanced, nutrient-dense approach that helps maintain stable blood sugar levels throughout the day. With a focus on low glycemic index foods, fiber-rich vegetables, and heart-healthy fats, this diet plan is designed to ensure that individuals with diabetes can enjoy delicious meals while managing their condition. The meal plan adjusts in real-time based on your activity levels, stress, and even sleep patterns, ensuring that you maintain optimal blood sugar levels at all times. It includes tasty recipes that won’t leave you feeling deprived and ensures you get the necessary nutrients to prevent long-term complications. Additionally, we provide education on carbohydrate counting, how to handle blood sugar spikes after meals, and what to do when faced with special situations like family dinners or holiday treats. Our system monitors your blood glucose data in real-time, adjusting your food plan accordingly and providing instant feedback if adjustments are necessary. You’ll also receive daily tips on how to make your diet more enjoyable while still keeping your condition in check. Moreover, our diabetes diet plan also includes practical advice on how to eat out at restaurants without derailing your progress, ensuring you can maintain your diet regardless of where you are or what’s on the menu. We aim to make managing diabetes as stress-free as possible.",
    icon: <FaHeartbeat className={styles.featureIcon} />,
    image: diabetesDietImage,
  },
  {
    id: "4",
    title: "Supplement Support Plan",
    description:
      "Our AI-powered supplement support plan takes into consideration your body composition, workout intensity, and fitness goals to recommend supplements that enhance performance, recovery, and overall wellness. You’ll receive recommendations for protein powders, pre-workout supplements, creatine, BCAAs, omega-3s, and even vitamin D—based on your specific needs. All recommendations are reviewed by certified nutritionists and dietitians to ensure they are safe and effective. The system adapts recommendations based on new research in the field and also considers your dietary habits, ensuring that you aren’t overdosing on nutrients already consumed through food. You will also get a customized schedule on when and how to take these supplements to maximize their efficacy. Our supplement plan also tracks your body’s reaction to different supplements, such as checking your hydration levels, muscle soreness, and general energy levels. If any negative reactions occur, the plan will adjust the supplements or their dosages accordingly. You’ll receive information on sourcing high-quality supplements from trusted manufacturers, ensuring safety and effectiveness. Plus, our AI monitors the latest supplement studies and adjusts recommendations as new, scientifically backed products become available. The system even offers suggestions for cycling certain supplements to avoid building up tolerance or dependence over time, making sure your body responds optimally to every supplement.",
    icon: <FaCapsules className={styles.featureIcon} />,
    image: supplementsImage,
  },
  {
    id: "5",
    title: "Data Privacy",
    description:
      "We know how important your privacy is. Our platform is built on a robust foundation of data encryption and follows the highest standards in data privacy laws such as GDPR and CCPA. This means that your personal information, workout details, dietary preferences, and health metrics are stored in secure databases, only accessible by you and your authorized trainers. We never share your data with third parties without your explicit consent. Our platform includes a detailed audit trail of every data transaction, so you know exactly where your information is being used. We also provide the option to delete your account and permanently erase all your data from our systems at any time, giving you complete control. Furthermore, we provide detailed information on how your data is used, who has access to it, and how long it is stored. You can request full data export at any time, and our system will generate a comprehensive report detailing all data interactions. We have also implemented multi-factor authentication and advanced monitoring to prevent unauthorized access. Our commitment to transparency means that we regularly publish audits of our data practices and provide educational resources on how to manage your digital footprint effectively. Additionally, if any security breach occurs, you will be immediately notified and provided with actionable steps to safeguard your information.",
    icon: <FaLock className={styles.featureIcon} />,
    image: dataPrivacyImage,
  },
  {
    id: "6",
    title: "Progress Tracking",
    description:
      "Progress tracking is key to achieving long-term success in fitness. Our system provides detailed analytics on your workouts, meals, sleep patterns, and even stress levels. Using data from wearable devices, the platform tracks your daily activities and generates weekly and monthly reports that show your progress. These reports highlight areas of improvement and suggest adjustments to your workout or meal plan to ensure consistent progress. You can also visualize your progress with charts, graphs, and timelines, making it easy to see how far you've come. Our goal is to make sure you stay motivated and on track with your fitness journey by celebrating milestones and offering rewards for achieving your fitness goals. Beyond just workouts, our platform can integrate your daily mood logs, recovery scores, and mindfulness practices to give you a 360-degree view of your overall health and fitness. You can share these insights with your personal trainer to receive even more personalized adjustments to your regimen. Our system is smart enough to correlate different factors like sleep and stress levels, giving you insights into how these affect your performance. Additionally, the progress tracker compares your data with global fitness trends, showing how you stack up against people in similar categories worldwide. This global comparison can serve as both a motivational tool and a guide for further improvements in your fitness journey.",
    icon: <FaChartLine className={styles.featureIcon} />,
    image: progressTrackingImage,
  },
];

const FeaturesPage = () => {
  // const { featureId } = useParams(); // Fetch the feature ID from the URL
  // const [feature, setFeature] = useState(null);

  // useEffect(() => {
  //   // Simulate fetching the feature details from a database or API
  //   const fetchedFeature = fetchFeatureDetails(featureId);
  //   setFeature(fetchedFeature);
  // }, [featureId]);

  // if (!feature) {
  //   return <div>Loading...</div>;
  // }

  const navigate = useNavigate(); // Initialize useNavigate
  const [showScroll, setShowScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navigateHome = () => {
    navigate("/"); // Navigate to Home
    scrollTop(); // Scroll to the top of Home page
  };
  return (
    <Container className={styles.featurePage}>
      {/* Back to Home link (Top) */}
      <div className={styles.backToHomeTop}>
        <button variant="link" className={styles.button} onClick={navigateHome}>
          {" "}
          <div className={styles.buttonbox}>
            <span className={styles.buttonelem}>
              <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
              </svg>
            </span>
            <span className={styles.buttonelem}>
              <svg viewBox="0 0 46 40">
                <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
              </svg>
            </span>
          </div>
        </button>
      </div>
      {/* Section title */}
      <h1 className={styles.sectionTitle}>Our Signature Features</h1>
      <div className={styles.sectionDivider}></div>

      {featureDetails.map((feature, index) => (
        <React.Fragment key={feature.id}>
          <Row key={index}>
            <Col md={12} className={styles.featureCol}>
              <h2 className={styles.featureTitle}>
                {feature.icon} {feature.title}
              </h2>

              <div
                className={styles.featureDescriptionContainer}
                style={{
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                <div className={styles.featureCard}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={styles.featureImage}
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* Horizontal Divider */}
          <hr className={styles.featureDivider} />
        </React.Fragment>
      ))}

      {/* Back to Home link (Bottom) */}
      <div className={styles.backToHomeBottom}>
        <button className={styles.learnmore} onClick={navigateHome}>
          <span className={styles.buttontext}>Fitnesstan</span>
          <span aria-hidden="true" className={styles.circle}>
            <span className={`${styles.icon} ${styles.arrow}`}></span>
          </span>
        </button>
      </div>

      {/* Back to Top Button */}
      {showScroll && (
        <div className={styles.scrollTopButton}>
          <button className={styles.topbutton} onClick={scrollTop}>
            <svg className={styles.svgIcon} viewBox="0 0 384 512">
              <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
            </svg>
          </button>
        </div>
      )}
    </Container>
  );
};

export default FeaturesPage;
