import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import Sidebar from "./Sidebar";
import Loader from "../Loader"; // Import your custom loader
import {
  fetchAllUsers,
  updateUser,
  deactivateUser,
} from "../../API/AdminAPI.jsx";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchAllUsers();

        // Since response is an array, we set users directly
        if (Array.isArray(response)) {
          setUsers(response);
          setFilteredUsers(response);
        } else {
          console.error(
            "Unexpected response format: data is not an array",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = users.filter(
      (user) =>
        (user.username &&
          user.username.toLowerCase().includes(value.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      await updateUser(selectedUser.id, selectedUser);
      setShowEditModal(false);
      const response = await fetchAllUsers();
      if (Array.isArray(response)) {
        setUsers(response);
        setFilteredUsers(response);
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleDeactivate = async (userId) => {
    console.log("Attempting to deactivate user:", { userId }); // Debug: log user ID before API call

    try {
      // Call the API to deactivate the user, passing the user ID
      const response = await deactivateUser(userId);

      // Debugging response
      console.log("Deactivation response:", response); // Debug: log response from deactivateUser API

      // Check if the response indicates success
      if (response.status === "success") {
        console.log("User deactivated successfully: ", userId); // Debug: successful deactivation log

        // After deactivating the user, fetch the updated list of users
        const refreshedUsers = await fetchAllUsers();
        setUsers(refreshedUsers);
        setFilteredUsers(refreshedUsers);
      } else {
        console.error("Failed to deactivate user", response); // Debug: failure log
      }
    } catch (error) {
      console.error("Error deactivating user", error); // Debug: log any errors during deactivation
    }
  };

  if (loading) return <Loader />;

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
                <tr key={user.id.timestamp}>
                  {" "}
                  {/* Assuming id is an object, use a unique property */}
                  <td>{user.username || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.roles ? user.roles.join(", ") : "No roles"}</td>
                  <td>{user.status || "N/A"}</td>
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
                      onClick={() => {
                        console.log("Deactivating user with ID:", user.id); // Debug: log user ID and role for deactivation
                        handleDeactivate(user.id);
                      }}
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
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
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
                    setSelectedUser({
                      ...selectedUser,
                      roles: e.target.value.split(", "),
                    })
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
