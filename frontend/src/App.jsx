import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { api } from "./api";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import AdminEvents from "./pages/AdminEvents";
import EventForm from "./pages/EventForm";
import EventRegistrations from "./pages/EventRegistrations";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, adminOnly = false }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/events" replace />;

  return children;
}

function Navbar({ user, onLogout }) {
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link className="brand" to={user.role === "admin" ? "/admin-events" : "/events"}>
          <span className="brand-mark">EZ</span>
          EventZone
        </Link>

        <nav className="nav-links">
          {user.role === "user" ? (
            <>
              <Link className={location.pathname === "/events" ? "active" : ""} to="/events">
                Events
              </Link>
              <Link
                className={location.pathname === "/my-registrations" ? "active" : ""}
                to="/my-registrations"
              >
                My Registrations
              </Link>
            </>
          ) : (
            <Link
              className={location.pathname === "/admin-events" ? "active" : ""}
              to="/admin-events"
            >
              Manage Events
            </Link>
          )}
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    navigate(data.user.role === "admin" ? "/admin-events" : "/events");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  async function handleRegister(data) {
    await api.register(data);
    navigate("/login", { state: { message: "Registration successful. Please login." } });
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <main className={user ? "page" : "auth-page"}>
        <Routes>
          <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin-events" : "/events") : "/login"} replace />} />

          <Route
            path="/login"
            element={user ? <Navigate to={user.role === "admin" ? "/admin-events" : "/events"} replace /> : <Login onLogin={handleLogin} />}
          />

          <Route
            path="/register"
            element={user ? <Navigate to="/events" replace /> : <Register onRegister={handleRegister} />}
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-events"
            element={
              <ProtectedRoute adminOnly>
                <AdminEvents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-events/new"
            element={
              <ProtectedRoute adminOnly>
                <EventForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-events/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EventForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-events/:id/registrations"
            element={
              <ProtectedRoute adminOnly>
                <EventRegistrations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
