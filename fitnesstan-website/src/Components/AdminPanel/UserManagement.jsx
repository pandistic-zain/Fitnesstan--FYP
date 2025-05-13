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

   // Fetch all users when the page loads (useEffect)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        console.log("Users after fetching:", data); // Log to verify
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

    fetchUsers();
  }, []); // Runs once when the component mounts
  
  const refreshUsers = async () => {
  setLoading(true);
  try {
    const data = await fetchAllUsers();
    console.log("Users after fetching:", data); // Log the response to verify
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
    console.log("Users after fetching:", users); // Log state after setting users
  }, [users]);

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
      if (response.status === 200) {
        setShowEditModal(false);
      } else {
        console.error("Update failed with status:", response.status);
      }
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
        <h2 class="text-center fs-2 fw-bold">User Management</h2>
        <Form.Group className="mb-3 form-dark ">
          <Form.Control
            type="text"
            placeholder="Search by username or email…"
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>

       <Table striped bordered hover responsive className="table-dark">
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
                  <td>{user.roles?.join(", ")}</td>
                  <td>{user.status}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleEdit(user)}
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
