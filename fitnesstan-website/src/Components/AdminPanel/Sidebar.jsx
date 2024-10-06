// src/components/AdminDashboard/Sidebar.jsx
import React from "react";
import SidebarMenu from "react-bootstrap-sidebar-menu";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css"; // Ensure this path matches your structure

const Sidebar = () => {
  return (
    <SidebarMenu className={styles.sidebar}>
      <SidebarMenu.Header className={styles.header}>
        <SidebarMenu.Brand className={styles.brand}>
          Fitnesstan Admin
        </SidebarMenu.Brand>
        <SidebarMenu.Toggle />
      </SidebarMenu.Header>
      <SidebarMenu.Body className={styles.body}>
        <SidebarMenu.Nav>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/dashboard"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-tachometer-alt"></i> {/* Dashboard Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle} mt-3>
              Dashboard
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/user-management"
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
            to="/article-management"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-newspaper"></i>{" "}
              {/* Article Management Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle}>
              Articles
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/supplement-management"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-capsules"></i>{" "}
              {/* Supplement Management Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle}>
              Supplements
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Sub>
            <SidebarMenu.Sub.Toggle
              className={`${styles.navLink} sidebar-link ${styles.toggle}`}
            >
              <SidebarMenu.Nav.Icon
                className={`${styles.navIcon} sidebar-icon`}
              >
                <i className="fas fa-chart-line"></i>{" "}
                {/* ML Plan Management Icon */}
              </SidebarMenu.Nav.Icon>
              <SidebarMenu.Nav.Title className={styles.navTitle}>
                ML Plans
              </SidebarMenu.Nav.Title>
              <span className={styles.caret}></span>{" "}
              {/* Caret icon for toggle indication */}
            </SidebarMenu.Sub.Toggle>
            <SidebarMenu.Sub.Collapse>
              <SidebarMenu.Nav>
                <SidebarMenu.Nav.Link
                  as={Link}
                  to="/ml-plan-1"
                  className={`${styles.subNavLink} sidebar-link`}
                >
                  <SidebarMenu.Nav.Icon
                    className={`${styles.navIcon} sidebar-icon`}
                  >
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {/* Icon for Plan 1 */}
                  </SidebarMenu.Nav.Icon>
                  <SidebarMenu.Nav.Title className={styles.navTitle}>
                    Plan 1
                  </SidebarMenu.Nav.Title>
                </SidebarMenu.Nav.Link>
                <SidebarMenu.Nav.Link
                  as={Link}
                  to="/ml-plan-2"
                  className={`${styles.subNavLink} sidebar-link`}
                >
                  <SidebarMenu.Nav.Icon
                    className={`${styles.navIcon} sidebar-icon`}
                  >
                    <i className="fas fa-calendar-alt"></i>{" "}
                    {/* Icon for Plan 2 */}
                  </SidebarMenu.Nav.Icon>
                  <SidebarMenu.Nav.Title className={styles.navTitle}>
                    Plan 2
                  </SidebarMenu.Nav.Title>
                </SidebarMenu.Nav.Link>
              </SidebarMenu.Nav>
            </SidebarMenu.Sub.Collapse>
          </SidebarMenu.Sub>

          <SidebarMenu.Nav.Link
            as={Link}
            to="/diabetes-care-management"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-heartbeat"></i>{" "}
              {/* Diabetes Care Management Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle}>
              Diabetes Care
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/notifications-management"
            className={`${styles.navLink} sidebar-link`}
          >
            <SidebarMenu.Nav.Icon className={`${styles.navIcon} sidebar-icon`}>
              <i className="fas fa-bell"></i>{" "}
              {/* Notifications Management Icon */}
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title className={styles.navTitle}>
              Notifications
            </SidebarMenu.Nav.Title>
          </SidebarMenu.Nav.Link>
          <SidebarMenu.Nav.Link
            as={Link}
            to="/admin-settings"
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
