import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { registerUser } from "../../API/RegisterAPI";
import Loader from "../Loader";
import styles from "./AdditionalInfoForm.module.css"; // Import CSS module

const AdditionalInfoForm = () => {
  const [formData, setFormData] = useState({
    heightFt: "",
    dob: "",
    weightKg: "",
    gender: "",
    occupation: "",
    religion: "",
    exerciseLevel: "",
    sleepHours: "",
    medicalHistory: [],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { signUpData } = location.state || {};
  if (!signUpData) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicalHistoryChange = (e, value) => {
    const isChecked = e.target.checked;

    if (value === "None" && isChecked) {
      setFormData({ ...formData, medicalHistory: ["None"] });
    } else if (isChecked) {
      setFormData({
        ...formData,
        medicalHistory: formData.medicalHistory
          .filter((item) => item !== "None")
          .concat(value),
      });
    } else {
      setFormData({
        ...formData,
        medicalHistory: formData.medicalHistory.filter(
          (item) => item !== value
        ),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const payload = {
      user: {
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
      },
      additionalInfo: formData,
    };

    try {
      await registerUser(payload);
      navigate(
        `/email-verification?email=${encodeURIComponent(signUpData.email)}`
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to submit user data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backgroundDiv}>
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col>
            <h2 className={styles.textCenter}>Additional Information</h2>
            {loading && <Loader />}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="heightFt" className="mb-3">
                <Form.Label>Height (ft)</Form.Label>
                <Form.Control
                  className={styles.formControl}
                  type="number"
                  step="0.1"
                  name="heightFt"
                  placeholder="Enter your height in feet"
                  value={formData.heightFt}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="dob" className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  className={styles.formControl}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="weightKg" className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control
                  className={styles.formControl}
                  type="number"
                  step="0.1"
                  name="weightKg"
                  placeholder="Enter your weight in kilograms"
                  value={formData.weightKg}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="gender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <div>
                  {["Male", "Female", "Other"].map((gender) => (
                    <Form.Check
                      key={gender}
                      inline
                      label={gender}
                      name="gender"
                      type="radio"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                      required
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group controlId="occupation" className="mb-3">
                <Form.Label>Occupation</Form.Label>
                <Form.Select
                  className={styles.formSelect}
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your occupation</option>
                  {[
                    "Software Engineer",
                    "Doctor",
                    "Teacher",
                    "Student",
                    "Other",
                  ].map((occupation) => (
                    <option key={occupation} value={occupation}>
                      {occupation}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="religion" className="mb-3">
                <Form.Label>Religion</Form.Label>
                <div>
                  {["Christianity", "Islam", "Hinduism", "Other"].map(
                    (religion) => (
                      <Form.Check
                        key={religion}
                        inline
                        label={religion}
                        name="religion"
                        type="radio"
                        value={religion}
                        checked={formData.religion === religion}
                        onChange={handleChange}
                        required
                      />
                    )
                  )}
                </div>
              </Form.Group>

              <Form.Group controlId="exerciseLevel" className="mb-3">
                <Form.Label>Exercise Level</Form.Label>
                <Form.Select
                  className={styles.formSelect}
                  name="exerciseLevel"
                  value={formData.exerciseLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your exercise level</option>
                  {["Low", "Medium", "High"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="sleepHours" className="mb-3">
                <Form.Label>Sleep Hours</Form.Label>
                <Form.Select
                  className={styles.formSelect}
                  name="sleepHours"
                  value={formData.sleepHours}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your average sleep hours</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} hours
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="medicalHistory" className="mb-3">
                <Form.Label>Medical History</Form.Label>
                <div>
                  {["None", "Diabetic", "Heart Disease"].map((condition) => (
                    <Form.Check
                      key={condition}
                      type="checkbox"
                      label={condition}
                      value={condition}
                      checked={formData.medicalHistory.includes(condition)}
                      onChange={(e) =>
                        handleMedicalHistoryChange(e, condition)
                      }
                      disabled={
                        formData.medicalHistory.includes("None") &&
                        condition !== "None"
                      }
                    />
                  ))}
                </div>
              </Form.Group>

              <Button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading}
              >
                Submit
              </Button>
              {errorMessage && <p className={styles.textDanger}>{errorMessage}</p>}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdditionalInfoForm;
