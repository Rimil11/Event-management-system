import { useEffect, useState } from "react";
import { api } from "../api";
import EventCard from "../components/EventCard";
import Message from "../components/Message";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getEvents().then(setEvents).catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DISCOVER</span>
          <h1>Upcoming Events</h1>
          <p>Explore events and register for the ones you like.</p>
        </div>
      </div>

      {error && <Message>{error}</Message>}

      {events.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-icon">○</div>
          <h2>No events available</h2>
          <p>There are no events to display right now.</p>
        </div>
      ) : (
        <div className="event-grid">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </section>
  );
}
