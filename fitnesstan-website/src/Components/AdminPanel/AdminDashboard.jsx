// src/components/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    return (
        <div className={styles.adminDashboard}>
           <Sidebar />
            <Container className={styles.dashboardContent}>
                <h2>Admin Dashboard</h2>
                <div className={styles.card}>
                    <h3>Overview</h3>
                    {/* Add your dashboard metrics and graphs here */}
                </div>
            </Container>
        </div>
    );
};

export default AdminDashboard;
