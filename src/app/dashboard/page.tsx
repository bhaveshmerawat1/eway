"use client";
import React, { useEffect, useState } from "react";
import "./page.css"; // custom css

type User = {
  id: number;
  name: string;
  email: string;
};

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load users from localStorage
  useEffect(() => {
    const usersString = localStorage.getItem("users");
    const storedUsers = usersString
      ? JSON.parse(usersString)
      : [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ];
    setUsers(storedUsers);
  }, []);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleDelete = (id:number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEdit = (user:User) => {
    setEditingUser(user);
  };

  const handleUpdate = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  };

  const handleAdd = () => {
    const newUser = {
      id: Date.now(),
      name: "New User",
      email: "new@example.com",
    };
    setUsers([...users, newUser]);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>

      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleAdd}>+ Add User</button>
      </div>

      {/* User List */}
      <ul className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} className="user-item">
              <div>
                <p className="name">{user.name}</p>
                <p className="email">{user.email}</p>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(user)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="empty">No users found.</li>
        )}
      </ul>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={() => setEditingUser(null)}>Cancel</button>
              <button onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
