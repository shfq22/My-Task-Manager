// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import UserCard from "../components/admin/UserCard";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-slate-800 mb-6">
        Admin Panel
      </h2>

      {errorMsg && (
        <div className="text-red-600 text-sm mb-4 text-center">{errorMsg}</div>
      )}

      {loading ? (
        <div className="text-center text-slate-500">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} onRefresh={fetchUsers} />
          ))}
        </div>
      )}
    </div>
  );
}
