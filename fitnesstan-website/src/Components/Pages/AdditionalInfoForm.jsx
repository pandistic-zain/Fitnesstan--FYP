import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { submitAdditionalInfo } from "../../API/RegisterAPI"; // Ensure this API method is implemented in your backend

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

  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query params
  const email = new URLSearchParams(location.search).get("email");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit additional information
      await submitAdditionalInfo({ ...formData, email });

      // Navigate to verify email page
      navigate(`/email-verification?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error submitting additional information: ", error);
      alert("Failed to submit additional information. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Additional Information</h2>
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
              <Form.Select
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                required
              >
                <option value="">Select your medical history</option>
                <option value="None">None</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Asthma">Asthma</option>
                <option value="Heart Disease">Heart Disease</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdditionalInfoForm;
