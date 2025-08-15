import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import Skeleton from "react-loading-skeleton";
const priorityColor = {
  LOW: "bg-orange-100 text-orange-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
};

const statusColor = {
  pending: "bg-gray-200 text-gray-700",
  completed: "bg-green-100 text-green-800",
};

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/tasks/${taskId}`);
        setTask(res.data.data);
      } catch (err) {
        console.error("Failed to fetch task details", err);
        alert("Could not load task");
        navigate("/");
      }
    })();
  }, [taskId]);

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Skeleton height={30} width={200} />
        <Skeleton height={20} width={120} className="mt-2" />
        <Skeleton count={5} className="mt-4" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-sm border border-gray-200 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{task.title}</h2>
        <div className="flex gap-2 mt-1">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              priorityColor[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              statusColor[task.status || "pending"]
            }`}
          >
            {task.status || "pending"}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-1">
          Description
        </h4>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {task.description}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Due on:{" "}
          <span className="text-gray-800 font-medium">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </p>
      </div>

      {task.attachedDocument?.filter(Boolean).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Attached Documents
          </h4>
          <ul className="space-y-2">
            {task.attachedDocument.map((doc, index) =>
              doc ? (
                <li key={index}>
                  <a
                    href={doc.url || doc.secure_url || doc}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    📄 View Document {index + 1}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back
      </button>
    </div>
  );
}
