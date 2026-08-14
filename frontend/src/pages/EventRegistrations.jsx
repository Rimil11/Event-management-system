import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import Message from "../components/Message";

export default function EventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getEventRegistrations(id)
      .then(setRegistrations)
      .catch((err) => setError(err.message));
  }, [id]);

  const eventName = registrations[0]?.event?.name || "Event";

  return (
    <section>
      <Link className="back-link" to="/admin-events">← Back to events</Link>

      <div className="page-heading">
        <div>
          <span className="eyebrow">REGISTRATIONS</span>
          <h1>{eventName}</h1>
          <p>Users registered for this event.</p>
        </div>
      </div>

      {error && <Message>{error}</Message>}

      {registrations.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-icon">○</div>
          <h2>No registrations</h2>
          <p>No users have registered for this event yet.</p>
        </div>
      ) : (
        <div className="registration-list">
          {registrations.map((registration, index) => (
            <div className="registration-row" key={registration._id}>
              <div className="user-number">{index + 1}</div>
              <div>
                <strong>{registration.user.name}</strong>
                <span>{registration.user.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
