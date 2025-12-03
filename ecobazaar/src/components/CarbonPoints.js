import React from "react";

export default function CarbonPoints() {
  const userPoints = 120;
  const badges = ["Eco Starter", "Carbon Saver"];

  return (
    <div>
      <h2>🌟 Your Carbon Points</h2>
      <p>Track your sustainability achievements and earn rewards.</p>

      <div style={{ marginTop: "20px", background: "#e8f5e9", padding: "20px", borderRadius: "8px" }}>
        <h3>Total Points: {userPoints}</h3>
        <p>Keep earning by buying eco-friendly products and sharing green tips!</p>

        <h4 style={{ marginTop: "15px" }}>🏅 Badges Earned:</h4>
        <ul>
          {badges.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
