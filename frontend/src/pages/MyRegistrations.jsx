import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Message from "../components/Message";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMyRegistrations().then(setRegistrations).catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR EVENTS</span>
          <h1>My Registrations</h1>
          <p>Events you have registered for.</p>
        </div>
      </div>

      {error && <Message>{error}</Message>}

      {registrations.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-icon">□</div>
          <h2>No registrations yet</h2>
          <p>Register for an event and it will appear here.</p>
          <Link className="button primary" to="/events">Browse Events</Link>
        </div>
      ) : (
        <div className="event-grid">
          {registrations.map((registration) => (
            <article className="event-card" key={registration._id}>
              <div className="event-card-top">
                <span className="event-date">{registration.event.date}</span>
              </div>
              <h3>{registration.event.name}</h3>
              <p className="event-description">{registration.event.description}</p>
              <div className="event-meta">
                <span>◷ {registration.event.time}</span>
                <span>⌖ {registration.event.venue}</span>
              </div>
              <Link className="button secondary full-width" to={`/events/${registration.event._id}`}>
                View Event
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
