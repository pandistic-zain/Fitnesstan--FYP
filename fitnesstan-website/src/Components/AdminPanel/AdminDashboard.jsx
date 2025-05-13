// src/components/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Container } from "react-bootstrap";
import styles from "./AdminDashboard.module.css";
import { fetchFeedbacks } from "../../API/RegisterAPI"; // assuming you have deleteFeedback API function
import { deleteFeedback } from "../../API/AdminAPI"; // assuming you have deleteFeedback API function

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks()
      .then((data) => {
        console.log("Fetched feedbacks:", data);
        setFeedbacks(data);
      })
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

  const handleDelete = async (id) => {
    console.debug("Deleting feedback with ID:", id); // Debug line to trace which feedback is being deleted

    try {
      // Send the request to delete the feedback
      const response = await deleteFeedback(id);
      console.debug("Delete feedback response:", response); // Debug line to check the response from the API

      // Filter out the deleted feedback from the state
      setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
      console.debug("Updated feedbacks state:", feedbacks); // Debug line to check the updated state after deletion
    } catch (error) {
      console.error("Error deleting feedback:", error); // Log error if deletion fails
      console.debug(
        "Error details:",
        error.response ? error.response.data : error
      ); // Debugging error response details
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <Sidebar />
      <Container className={styles.dashboardContent}>
        <h2 class="text-center fs-2 fw-bold">Admin Dashboard</h2>
        <div className={styles.parentcard}>
          <section className={styles.testimonialsSection} id="testimonials">
            <h2 className={styles.sectionTitle}>What Our Users Say !!!</h2>
            <div className={styles.testimonialRow}>
              {feedbacks.length === 0 && <p>Loading testimonials…</p>}
              {feedbacks.map((fb, i) => (
                <div className={styles.card} key={i}>
                  <div className={styles.bg}></div>
                  <div className={styles.blob}></div>
                  <p className={styles.testimonialText}>{fb.feedback}</p>
                  <p className={styles.testimonialAuthor}>- {fb.name}</p>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(fb.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
