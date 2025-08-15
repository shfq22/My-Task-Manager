import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../contexts/authContext";
import toast from "react-hot-toast";
const priorityColor = {
  LOW: "bg-orange-100 text-orange-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
};

const statusColor = {
  pending: "bg-gray-200 text-gray-700",
  completed: "bg-green-100 text-green-800",
};

export default function TaskCard({ task, onDelete, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate?.slice(0, 10),
    priority: task.priority,
  });

  const isAssignedToUser = user?._id === task.assignedTo._id;
  const isOverdue =
    task.status === "pending" &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/tasks/${task._id}`, editForm);
      setIsEditing(false);
      onUpdate();
      toast.success("Task updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Task update failed.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`/tasks/${task._id}`);
      onDelete();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Task deletion failed.");
    }
  };

  const handleMarkComplete = async () => {
    try {
      await axios.patch(`/tasks/${task._id}/status`, { status: "completed" });
      onUpdate();
    } catch (err) {
      console.error("Failed to complete task:", err);
      alert("Could not update task status.");
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition hover:shadow-md ${
        isOverdue ? "ring-2 ring-red-500" : ""
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Title"
            required
          />
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Description"
            required
          />
          <input
            type="date"
            value={editForm.dueDate}
            onChange={(e) =>
              setEditForm({ ...editForm, dueDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
          <select
            value={editForm.priority}
            onChange={(e) =>
              setEditForm({ ...editForm, priority: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          >
            <option value="">Select priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:underline text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            <div className="flex gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  priorityColor[task.priority]
                }`}
              >
                {task.priority}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  statusColor[task.status || "pending"]
                }`}
              >
                {task.status || "PENDING"}
              </span>
            </div>
          </div>

          {user?.role === "admin" && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-gray-900">
                {task.assignedTo?.name}
              </span>
            </p>
          )}

          <p className="text-xs text-gray-500 mb-4">
            Due:{" "}
            <span className="font-medium text-gray-800">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </p>

          <div className="flex flex-wrap gap-4 text-sm pt-1">
            {user?.role === "admin" && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </>
            )}

            {isAssignedToUser && task.status !== "completed" && (
              <button
                onClick={handleMarkComplete}
                className="text-green-600 hover:underline"
              >
                Mark as Complete
              </button>
            )}

            <Link
              to={`/tasks/${task._id}`}
              className="text-gray-600 hover:underline"
            >
              View Details →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
