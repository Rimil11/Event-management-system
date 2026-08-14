import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, SERVER_URL } from "../api";
import Message from "../components/Message";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api.getEvent(id).then(setEvent).catch((err) => setError(err.message));
  }, [id]);

  async function register() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await api.registerForEvent(id);
      setSuccess("You are successfully registered for this event.");
      setEvent((current) => ({
        ...current,
        registeredCount: current.registeredCount + 1
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error && !event) return <Message>{error}</Message>;
  if (!event) return <div className="loading">Loading event...</div>;

  const isFull = event.registeredCount >= event.maximumCapacity;

  return (
    <section className="details-page">
      <Link className="back-link" to="/events">← Back to events</Link>

      <div className="details-card">
        <div className="details-accent"></div>
        <div className="details-content">
          {event.imageUrl && <img className="details-image" src={`${SERVER_URL}${event.imageUrl}`} alt={event.name} />}
          <span className="eyebrow">EVENT DETAILS</span>
          <h1>{event.name}</h1>
          <p className="details-description">{event.description}</p>

          <div className="details-info">
            <div>
              <span>Date</span>
              <strong>{event.date}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{event.time}</strong>
            </div>
            <div>
              <span>Venue</span>
              <strong>{event.venue}</strong>
            </div>
            <div>
              <span>Registration</span>
              <strong>{event.registeredCount} / {event.maximumCapacity}</strong>
            </div>
          </div>

          {error && <Message>{error}</Message>}
          {success && <Message type="success">{success}</Message>}

          {user.role === "user" && (
            <button className="button primary" onClick={register} disabled={loading || isFull}>
              {loading ? "Registering..." : isFull ? "Event Full" : "Register for Event"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
