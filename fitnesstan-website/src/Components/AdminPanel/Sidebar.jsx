// src/components/AdminDashboard/Sidebar.jsx
import React, { useState } from "react";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css"; 
import logo from '../../Assets/FIRNESSTAN_BARA_LOGO.png'; 

const Sidebar = () => {
  const [mlPlansOpen, setMlPlansOpen] = useState(false);

  const toggleMlPlans = () => {
    setMlPlansOpen(!mlPlansOpen); // Toggle state
  };

  return (
    <SidebarMenu className={styles.sidebar}>
      <SidebarMenu.Header className={styles.header}>
      <SidebarMenu.Brand className={styles.brand}>
        <img src={logo} alt="Fitnesstan Admin Logo" className={styles.logo} />
      </SidebarMenu.Brand>
        <SidebarMenu.Toggle />
      </SidebarMenu.Header>
      <SidebarMenu.Body className={styles.body}>
        <SidebarMenu.Nav>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/AdminDashboard"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-tachometer-alt"></i> {/* Dashboard Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={`${styles.navTitle}`}>
              Dashboard
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/users"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-users"></i> {/* User Management Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle}>
              Users
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/changepassword"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-cog"></i> {/* Admin Settings Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle}>
              Settings
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
        </SidebarMenu.Nav>
      </SidebarMenu.Body>
    </SidebarMenu>
  );
};

export default Sidebar;
