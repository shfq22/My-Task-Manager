import React, { useState } from "react";
import axios from "../../utils/axios";
import TaskCard from "../TaskCard";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
export default function UserCard({ user, onRefresh }) {
  const [deleting, setDeleting] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    assignedTo: user._id,
    doc1: null,
    doc2: null,
    doc3: null,
  });

  const handleDelete = async () => {
    if (!confirm(`Delete user ${user.name}?`)) return;
    setDeleting(true);
    try {
      await axios.delete(`/admin/${user._id}`);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleTasks = async () => {
    if (showTasks) {
      setShowTasks(false);
      setShowTaskForm(false);
    } else {
      setLoadingTasks(true);
      try {
        const res = await axios.get(`/admin/${user._id}`);
        setTasks(res.data.data.tasks || []);
        setShowTasks(true);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        alert("Could not load tasks.");
      } finally {
        setLoadingTasks(false);
      }
    }
  };

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, docKey) => {
    setTaskForm({ ...taskForm, [docKey]: e.target.files[0] });
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", taskForm.title);
    form.append("description", taskForm.description);
    form.append("dueDate", taskForm.dueDate);
    form.append("priority", taskForm.priority);
    form.append("assignedTo", user._id);
    if (taskForm.doc1) form.append("doc1", taskForm.doc1);
    if (taskForm.doc2) form.append("doc2", taskForm.doc2);
    if (taskForm.doc3) form.append("doc3", taskForm.doc3);

    try {
      await axios.post("/tasks", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        doc1: null,
        doc2: null,
        doc3: null,
      });
      setShowTaskForm(false);
      toast.success("Task assigned!");
      toggleTasks(); // refresh
    } catch (err) {
      console.error("Failed to assign task", err);
      toast.error("Task assignment failed.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3 transition hover:shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{user.name}</h3>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          className="text-sm text-indigo-600 hover:underline"
          onClick={toggleTasks}
        >
          {showTasks ? "Hide Tasks" : "View Tasks"}
        </button>
        {showTasks && (
          <button
            onClick={() => setShowTaskForm((prev) => !prev)}
            className="text-sm text-green-600 hover:underline"
          >
            {showTaskForm ? "Cancel" : "Assign New Task"}
          </button>
        )}
      </div>

      {showTasks && (
        <div className="mt-2 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-3">
            {loadingTasks ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <Skeleton key={n} height={140} borderRadius={10} />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-slate-500">No tasks assigned.</p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={toggleTasks}
                  onUpdate={toggleTasks}
                />
              ))
            )}
          </div>

          {showTaskForm && (
            <form
              onSubmit={handleAssignTask}
              className="space-y-3 bg-white p-4 rounded-lg border border-slate-200"
            >
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              />

              <textarea
                name="description"
                value={taskForm.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              />

              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              />

              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              >
                <option value="">Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={(e) => handleFileChange(e, "doc1")}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={(e) => handleFileChange(e, "doc2")}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={(e) => handleFileChange(e, "doc3")}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm"
              >
                Assign Task
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
