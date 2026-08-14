const API_URL = "http://localhost:5000/api";
export const SERVER_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
export const api = {
  register: data => request("/auth/register", { method:"POST", body:JSON.stringify(data) }),
  login: data => request("/auth/login", { method:"POST", body:JSON.stringify(data) }),
  getEvents: () => request("/events"),
  getEvent: id => request(`/events/${id}`),
  createEvent: data => request("/events", { method:"POST", body:data }),
  updateEvent: (id,data) => request(`/events/${id}`, { method:"PUT", body:data }),
  deleteEvent: id => request(`/events/${id}`, { method:"DELETE" }),
  registerForEvent: id => request(`/registrations/${id}`, { method:"POST" }),
  getMyRegistrations: () => request("/registrations/my"),
  getEventRegistrations: id => request(`/registrations/event/${id}`)
};
