import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Sidebar from './Sidebar';
import Loader from '../Loader'; // Import your custom loader
import styles from './UserManagement.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Show loader
      try {
        const response = await axios.get("http://localhost:8080/admin/all-users");
        console.log("Response from backend:", response.data); // Debugging line to check response data
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };
    fetchUsers(); // Call fetchUsers inside useEffect
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log("Filtered Users:", filtered); // Debugging line to check filtered users
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    console.log("Editing user:", user); // Debugging line to check selected user
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    console.log("Saving changes for user:", selectedUser); // Debugging line to check updated user data
    try {
      await axios.put(`http://localhost:8080/admin/update-user/${selectedUser.id}`, selectedUser);
      setShowEditModal(false);
      const response = await axios.get("http://localhost:8080/admin/all-users");
      console.log("Updated users after save:", response.data); // Debugging line after saving
      setUsers(response.data);
      setFilteredUsers(response.data); // Update filtered users after save
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleDeactivate = async (userId) => {
    console.log("Deactivating user with ID:", userId); // Debugging line for deactivation
    try {
      await axios.delete(`http://localhost:8080/admin/delete-user/${userId}`);
      const updatedUsers = users.filter(user => user.id !== userId);
      console.log("Users after deactivation:", updatedUsers); // Debugging line to check users after deletion
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers); // Update filtered users after deletion
    } catch (error) {
      console.error("Error deactivating user", error);
    }
  };

  if (loading) return <Loader />; // Render loader while loading

  return (
    <div className={styles.userManagement}>
      <Sidebar />
      <div className={styles.userManagementContent}>
        <h2>User Management</h2>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roles.join(", ")}</td>
                  <td>{user.status}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.username || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, username: e.target.value })
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
                <Form.Label>Roles</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.roles?.join(", ") || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, roles: e.target.value.split(", ") })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser?.status || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, status: e.target.value })
                  }
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
