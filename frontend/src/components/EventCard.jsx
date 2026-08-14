import { Link } from "react-router-dom";
import { SERVER_URL } from "../api";

export default function EventCard({ event }) {
  return <article className="event-card">
    <div className="event-image">
      {event.imageUrl ? <img src={`${SERVER_URL}${event.imageUrl}`} alt={event.name} /> : <div className="image-placeholder">EVENT</div>}
    </div>
    <div className="event-card-body">
      <div className="event-card-top"><span className="event-date">{event.date}</span><span className="capacity-badge">Max {event.maximumCapacity}</span></div>
      <h3>{event.name}</h3>
      <p className="event-description">{event.description}</p>
      <div className="event-meta"><span>◷ {event.time}</span><span>⌖ {event.venue}</span></div>
      <Link className="button primary full-width" to={`/events/${event._id}`}>View Details</Link>
    </div>
  </article>;
}
