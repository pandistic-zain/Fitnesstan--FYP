import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { registerUser } from "../../API/RegisterAPI";
import styles from "./AdditionalInfoForm.module.css"; // Import the CSS module

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
    medicalHistory: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
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
      // If "None" is selected, clear all other selections
      setFormData({ ...formData, medicalHistory: ["None"] });
    } else if (isChecked) {
      // Add selected value to the array, excluding "None"
      setFormData({
        ...formData,
        medicalHistory: formData.medicalHistory
          .filter((item) => item !== "None")
          .concat(value),
      });
    } else {
      // Remove the unchecked value
      setFormData({
        ...formData,
        medicalHistory: formData.medicalHistory.filter((item) => item !== value),
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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
    }
  };

  return (
    <Container className={styles.container}>
      <Row className={styles.row}>
        <Col md={8} className={styles.col}>
          <h2 className={styles["text-center"]}>Additional Information</h2>
          <Form onSubmit={handleSubmit}>
            {/* Height (Feet) */}
            <Form.Group controlId="heightFt" className="mb-3">
              <Form.Label>Height (ft)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="heightFt"
                placeholder="Enter your height in feet"
                value={formData.heightFt}
                onChange={handleChange}
                className={styles["form-control"]}
                required
              />
            </Form.Group>

            {/* Date of Birth */}
            <Form.Group controlId="dob" className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={styles["form-control"]}
                required
              />
            </Form.Group>

            {/* Weight (kg) */}
            <Form.Group controlId="weightKg" className="mb-3">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="weightKg"
                placeholder="Enter your weight in kilograms"
                value={formData.weightKg}
                onChange={handleChange}
                className={styles["form-control"]}
                required
              />
            </Form.Group>

            {/* Gender */}
            <Form.Group controlId="gender" className="mb-3">
              <Form.Label>Gender</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Male"
                  name="gender"
                  type="radio"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
                <Form.Check
                  inline
                  label="Female"
                  name="gender"
                  type="radio"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
                <Form.Check
                  inline
                  label="Other"
                  name="gender"
                  type="radio"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
              </div>
            </Form.Group>

            {/* Occupation */}
            <Form.Group controlId="occupation" className="mb-3">
              <Form.Label>Occupation</Form.Label>
              <Form.Select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={styles["form-select"]}
                required
              >
                <option value="">Select your occupation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Doctor">Doctor</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            {/* Religion */}
            <Form.Group controlId="religion" className="mb-3">
              <Form.Label>Religion</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Christianity"
                  name="religion"
                  type="radio"
                  value="Christianity"
                  checked={formData.religion === "Christianity"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
                <Form.Check
                  inline
                  label="Islam"
                  name="religion"
                  type="radio"
                  value="Islam"
                  checked={formData.religion === "Islam"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
                <Form.Check
                  inline
                  label="Hinduism"
                  name="religion"
                  type="radio"
                  value="Hinduism"
                  checked={formData.religion === "Hinduism"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
                <Form.Check
                  inline
                  label="Other"
                  name="religion"
                  type="radio"
                  value="Other"
                  checked={formData.religion === "Other"}
                  onChange={handleChange}
                  className={styles["form-check-input"]}
                  required
                />
              </div>
            </Form.Group>

            {/* Exercise Level */}
            <Form.Group controlId="exerciseLevel" className="mb-3">
              <Form.Label>Exercise Level</Form.Label>
              <Form.Select
                name="exerciseLevel"
                value={formData.exerciseLevel}
                onChange={handleChange}
                className={styles["form-select"]}
                required
              >
                <option value="">Select your exercise level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>

            {/* Sleep Hours */}
            <Form.Group controlId="sleepHours" className="mb-3">
              <Form.Label>Sleep Hours</Form.Label>
              <Form.Select
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                className={styles["form-select"]}
                required
              >
                <option value="">Select your average sleep hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours</option>
                <option value="6">6 hours</option>
                <option value="7">7 hours</option>
                <option value="8">8 hours</option>
                <option value="9">9 hours</option>
                <option value="10">10 hours</option>
              </Form.Select>
            </Form.Group>

            {/* Medical History */}
            <Form.Group controlId="medicalHistory" className="mb-3">
              <Form.Label>Medical History</Form.Label>
              <div>
                {/* None */}
                <Form.Check
                  type="checkbox"
                  label="None"
                  value="None"
                  checked={formData.medicalHistory.includes("None")}
                  onChange={(e) => handleMedicalHistoryChange(e, "None")}
                  disabled={
                    formData.medicalHistory.includes("Heart Disease") ||
                    formData.medicalHistory.includes("Diabetic")
                  }
                  className={styles["form-check-input"]}
                />

                {/* Diabetic */}
                <Form.Check
                  type="checkbox"
                  label="Diabetic"
                  value="Diabetic"
                  checked={formData.medicalHistory.includes("Diabetic")}
                  onChange={(e) => handleMedicalHistoryChange(e, "Diabetic")}
                  disabled={formData.medicalHistory.includes("None")}
                  className={styles["form-check-input"]}
                />

                {/* Heart Disease */}
                <Form.Check
                  type="checkbox"
                  label="Heart Disease"
                  value="Heart Disease"
                  checked={formData.medicalHistory.includes("Heart Disease")}
                  onChange={(e) =>
                    handleMedicalHistoryChange(e, "Heart Disease")
                  }
                  disabled={formData.medicalHistory.includes("None")}
                  className={styles["form-check-input"]}
                />
              </div>
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" className={styles["btn-primary"]}>
              Submit
            </Button>
            {errorMessage && (
              <p className={styles["text-danger"]}>{errorMessage}</p>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdditionalInfoForm;
