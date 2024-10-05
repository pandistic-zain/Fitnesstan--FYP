import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css'; // Importing the CSS module

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here, possibly clear tokens and redirect to login
    navigate('/'); // Redirect to login page
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className={styles.welcomeMessage}>
        <h2>Welcome, Admin!</h2>
        <p>Manage your application and users efficiently.</p>
      </div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h3>User Management</h3>
          <p>View and manage registered users.</p>
          <button className={styles.actionButton} onClick={() => navigate('/admin/users')}>
            View Users
          </button>
        </div>
        <div className={styles.card}>
          <h3>Statistics</h3>
          <p>Overview of application usage and statistics.</p>
          <button className={styles.actionButton} onClick={() => navigate('/admin/stats')}>
            View Statistics
          </button>
        </div>
        <div className={styles.card}>
          <h3>Settings</h3>
          <p>Configure application settings.</p>
          <button className={styles.actionButton} onClick={() => navigate('/admin/settings')}>
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
