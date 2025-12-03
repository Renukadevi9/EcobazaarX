import React from "react";

export default function CarbonInsights() {
  const insights = [
    { category: "Household Items", carbon: 2.3 },
    { category: "Transport", carbon: 1.7 },
    { category: "Food", carbon: 3.0 },
  ];

  return (
    <div>
      <h2>📊 Carbon Insights Dashboard</h2>
      <p>Understand where your carbon emissions come from and how to reduce them.</p>

      <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#c8e6c9" }}>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #a5d6a7" }}>Category</th>
            <th style={{ padding: "10px", border: "1px solid #a5d6a7" }}>Carbon (kg CO₂e)</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: "10px", border: "1px solid #c8e6c9" }}>{item.category}</td>
              <td style={{ padding: "10px", border: "1px solid #c8e6c9" }}>{item.carbon}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <p><b>Tip:</b> Reduce transport emissions by using bicycles or public transit!</p>
      </div>
    </div>
  );
}
