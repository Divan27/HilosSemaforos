import { useEffect, useRef, useState } from "react";
import TrafficLight from "./TrafficLight";
import "./styles.css";

export default function App() {
  const directions = ["Norte", "Sur", "Este", "Oeste"];

  const [lights, setLights] = useState({
    Norte: "red",
    Sur: "red",
    Este: "red",
    Oeste: "red",
  });

  const workers = useRef({});
  const [running, setRunning] = useState(false);
  const stopFlag = useRef(false);

  const startSimulation = () => {
    if (running) return;

    stopFlag.current = false;
    setRunning(true);

    const order = [
      ["Norte"],
      ["Sur"],
      ["Este"],
      ["Oeste"]
    ];

    const cycle = async () => {
      while (!stopFlag.current) {
        for (const group of order) {
          if (stopFlag.current) break;

          // el que tiene turno se activa
          group.forEach((d) => workers.current[d].postMessage("GO"));

          // otros en rojo
          directions
            .filter((d) => !group.includes(d))
            .forEach((d) => workers.current[d].postMessage("STOP"));

          await new Promise((r) => setTimeout(r, 6000));
        }
      }
    };

    cycle();
  };

  const stopSimulation = () => {
    stopFlag.current = true;
    setRunning(false);

    directions.forEach((d) => workers.current[d].postMessage("STOP"));
  };

  useEffect(() => {
    directions.forEach((dir) => {
      const w = new Worker(new URL("./workers/lightWorker.js", import.meta.url));

      w.onmessage = (e) => {
        const { state } = e.data;
        setLights((prev) => ({ ...prev, [dir]: state }));
      };

      workers.current[dir] = w;
    });

    return () => {
      directions.forEach((d) => workers.current[d]?.terminate());
    };
  }, []);

  return (
    <div className="container">
      <h1 className="title">Cruce de Semáforos</h1>

      <div className="button-bar">
        <button className="start-btn" onClick={startSimulation}>
          Iniciar Simulación
        </button>

        <button className="stop-btn" onClick={stopSimulation}>
          Detener
        </button>
      </div>

      <div className="intersection">
        <div className="road horizontal"></div>
        <div className="road vertical"></div>

        <div className="light north"><TrafficLight color={lights.Norte} /></div>
        <div className="light south"><TrafficLight color={lights.Sur} /></div>
        <div className="light east"><TrafficLight color={lights.Este} /></div>
        <div className="light west"><TrafficLight color={lights.Oeste} /></div>
      </div>
    </div>
  );
}
