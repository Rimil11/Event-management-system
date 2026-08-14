import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, SERVER_URL } from "../api";
import Message from "../components/Message";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEvents() {
    try {
      setEvents(await api.getEvents());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function deleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.deleteEvent(id);
      setSuccess("Event deleted successfully.");
      loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <div className="page-heading admin-heading">
        <div>
          <span className="eyebrow">ADMIN / ORGANIZER</span>
          <h1>Manage Events</h1>
          <p>Create and manage your college events.</p>
        </div>
        <Link className="button primary" to="/admin-events/new">+ Create Event</Link>
      </div>

      {error && <Message>{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      {events.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-icon">+</div>
          <h2>No events created</h2>
          <p>Create your first event to get started.</p>
          <Link className="button primary" to="/admin-events/new">Create Event</Link>
        </div>
      ) : (
        <div className="admin-list">
          {events.map((event) => (
            <article className="admin-event" key={event._id}>
              {event.imageUrl ? <img className="admin-event-image" src={`${SERVER_URL}${event.imageUrl}`} alt={event.name}/> : <div className="admin-event-image image-placeholder small-placeholder">EVENT</div>}
              <div>
                <span className="event-date">{event.date}</span>
                <h3>{event.name}</h3>
                <p>{event.venue} · {event.time}</p>
              </div>
              <div className="admin-actions">
                <Link className="button small secondary" to={`/admin-events/${event._id}/registrations`}>
                  Registrations
                </Link>
                <Link className="button small secondary" to={`/admin-events/edit/${event._id}`}>
                  Edit
                </Link>
                <button className="button small danger" onClick={() => deleteEvent(event._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
