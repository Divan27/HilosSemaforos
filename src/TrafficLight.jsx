export default function TrafficLight({ color }) {
  return (
    <div className="traffic-light-box">
      <div className={`light-circle red ${color === "red" ? "on" : ""}`}></div>
      <div className={`light-circle yellow ${color === "yellow" ? "on" : ""}`}></div>
      <div className={`light-circle green ${color === "green" ? "on" : ""}`}></div>
    </div>
  );
}
