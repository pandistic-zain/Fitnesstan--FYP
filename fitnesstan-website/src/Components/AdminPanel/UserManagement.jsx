import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import Sidebar from "./Sidebar";
import Loader from "../Loader";
import {
  fetchAllUsers,
  updateUser,
  deactivateUser,
} from "../../API/AdminAPI.jsx";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // A single “reload everything” helper that flips loading on/off
  const refreshUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Expected an array, got:", data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.username || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      )
    );
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      // build payload of only the fields we actually edited
      const payload = {
        username: selectedUser.username,
        email: selectedUser.email,
        roles: selectedUser.roles,
        status: selectedUser.status,
      };
      // call API and get full response
      const response = await updateUser(selectedUser.id, payload);
      await refreshUsers();
      setShowEditModal(false);
      // if (response.status === 200) {
      //   setShowEditModal(false);
      // } else {
      //   console.error("Update failed with status:", response.status);
      // }
    } catch (err) {
      console.error("🔥 Error updating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId) => {
    console.debug("Deactivating user:", userId);
    setLoading(true);
    try {
      await deactivateUser(userId);
      await refreshUsers();
    } catch (err) {
      console.error("Error deactivating:", err);
    } finally {
      setLoading(false);
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
            placeholder="Search by username or email…"
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
              filteredUsers.map((u) => (
                <tr key={u.id.timestamp}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.roles?.join(", ")}</td>
                  <td>{u.status}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeactivate(u.id)}
                    >
                      Deactivate
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/** Username **/}
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={selectedUser?.username || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {/** Email **/}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      email: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {/** Roles (disabled for ADMIN) **/}
              <Form.Group className="mb-3">
                <Form.Label>Roles</Form.Label>
                <Form.Control
                  value={selectedUser?.roles?.join(", ") || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      roles: e.target.value.split(","),
                    })
                  }
                  disabled={selectedUser?.roles?.includes("ADMIN")} // Disable if role is ADMIN
                />
                {selectedUser?.roles?.includes("ADMIN") && (
                  <Form.Text className="text-muted">
                    You cannot edit the role of an ADMIN user.
                  </Form.Text>
                )}
              </Form.Group>
              {/** Status **/}
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  value={selectedUser?.status || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value,
                    })
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
