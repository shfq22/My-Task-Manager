import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext.jsx";
import { useEffect } from "react";
import axios from "./utils/axios";
import { Toaster } from "react-hot-toast";
export default function Layout() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/users/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          TaskManager
        </h1>

        <nav className="flex items-center flex-wrap gap-4 text-sm font-medium text-slate-700">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to={isAdminRoute ? "/" : "/admin"}
                  className="hover:underline hover:text-indigo-600"
                >
                  {isAdminRoute ? "View Site" : "Admin Panel"}
                </Link>
              )}
              <span className="text-slate-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:underline hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:underline hover:text-indigo-600"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
