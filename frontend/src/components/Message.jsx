export default function Message({ type = "error", children }) {
  return <div className={`message ${type}`}>{children}</div>;
}
