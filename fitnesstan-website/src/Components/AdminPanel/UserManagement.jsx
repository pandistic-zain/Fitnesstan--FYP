import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios"; // Ensure axios is installed
import Sidebar from './Sidebar';
import styles from './UserManagement.module.css'; // Importing CSS module

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For profile viewing/editing
  const [showEditModal, setShowEditModal] = useState(false); // Modal for editing user info

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // Replace with your actual API endpoint
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Open modal to edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Save edited user profile
  const handleSaveChanges = async () => {
    try {
      await axios.put(`/api/users/${selectedUser.id}`, selectedUser); // PUT request to update user
      setShowEditModal(false);
      // Refetch users after saving
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // Deactivate or delete a user
  const handleDeactivate = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`); // Delete request to deactivate user
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deactivating user", error);
    }
  };

  return (
    <div className={styles.userManagement}> {/* Flexbox container for Sidebar and UserManagement */}
      <Sidebar />
      <div className={styles.userManagementContent}>
        <h2>User Management</h2>

        {/* Search Bar */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by name, email, or plan type..."
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>

        {/* User Table */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Plan Type</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.planType}</td>
                <td>{user.lastLogin}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleEdit(user)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeactivate(user.id)}
                  >
                    Deactivate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit User Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.name || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Plan Type</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.planType || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, planType: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Login</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.lastLogin || ""}
                  readOnly
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
