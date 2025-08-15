import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "../utils/axios";
import TaskCard from "../components/TaskCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        user.role === "admin" ? "/admin/tasks" : "/tasks/user-tasks"
      );
      setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to load tasks", err);
      alert("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = () => fetchTasks();
  const handleUpdate = () => fetchTasks();

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setDueDateFilter("all");
  };

  const filteredTasks = tasks.filter((task) => {
    const now = new Date().setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate).setHours(0, 0, 0, 0);

    const matchesStatus =
      statusFilter === "all" ||
      task.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter.toUpperCase();

    const matchesDueDate =
      dueDateFilter === "all" ||
      (dueDateFilter === "overdue" && due < now) ||
      (dueDateFilter === "upcoming" && due >= now);

    return matchesStatus && matchesPriority && matchesDueDate;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {user.role === "admin" ? "All Tasks" : "My Tasks"}
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Due Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>

          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <Skeleton key={idx} height={180} borderRadius={12} />
            ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No tasks found for selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
