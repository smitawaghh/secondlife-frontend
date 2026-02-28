import React from "react";
import "./BarChart.css";

export default function BarChart({ title, points = [] }) {
  const max = Math.max(...points.map((p) => p.value), 1);

  return (
    <div className="barchart">
      {title ? <div className="barchartTitle">{title}</div> : null}

      <div className="bars">
        {points.map((p) => {
          const width = (p.value / max) * 100;

          return (
            <div className="barRow" key={p.label}>
              <div className="barLabel">{p.label}</div>

              <div className="barTrack">
                <div className="barFill" style={{ width: `${width}%` }} />
              </div>

              <div className="barValue">{p.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}