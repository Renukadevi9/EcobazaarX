import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import "../App.css";
import { CartContext } from "../CartContext"; // ✅ Import the Cart Context
import ecoHero from "../assets/eco-home.jpg";
import bottle from "../assets/water-bottle.jpg";
import bag from "../assets/cotton-bag.jpg";
import brush from "../assets/bamboo-toothbrush.jpg";
import straw from "../assets/metal-straw.jpg";
import { getProductImageFromObject } from "../utils/productImages";

export default function HomePage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // ✅ Access the addToCart function from context
  const { addToCart } = useContext(CartContext);

  // ✅ Get asset image for product
  const getImageForProduct = useCallback((item) => {
    return getProductImageFromObject(item);
  }, []);

  // ✅ Fetch recommendations from Flask backend
  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRecommendations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/recommendations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ Recommendations received:", data);
        
        if (data.recommendations && Array.isArray(data.recommendations)) {
          // Use asset images for recommendations
          const formattedRecs = data.recommendations.map(rec => ({
            ...rec,
            image: getProductImageFromObject(rec)
          }));
          setRecommendations(formattedRecs);
        } else {
          console.warn("⚠️ No recommendations in response:", data);
          setRecommendations([]);
        }
      } catch (err) {
        console.error("❌ Error fetching recommendations:", err);
        // Set empty array on error so UI shows "No recommendations" message
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [getImageForProduct]);

  return (
    <div className="home-page">
      {/* 🌿 Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${ecoHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "100px 20px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            padding: "60px 20px",
            borderRadius: "10px",
            maxWidth: "800px",
            margin: "auto",
          }}
        >
          <h1>Welcome to <b>EcoBazaar 🌱</b></h1>
          <p>Shop sustainable products, earn carbon points, and make every purchase count for the planet.</p>
          <button
            onClick={() => window.scrollTo(0, 700)}
            style={{
              marginTop: "25px",
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "#2e7d32",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* ♻️ Featured Products */}
      <section className="featured-products" style={{ padding: "40px 20px" }}>
        <h2 style={{ textAlign: "center", color: "#2e7d32" }}>
          ♻️ Featured Eco Products
        </h2>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          }}
        >
          {[
            { id: 1, name: "Bamboo Toothbrush", img: brush, carbon: "0.3 kg CO₂e", price: "₹120" },
            { id: 2, name: "Reusable Water Bottle", img: bottle, carbon: "0.8 kg CO₂e", price: "₹350" },
            { id: 3, name: "Organic Cotton Bag", img: bag, carbon: "0.5 kg CO₂e", price: "₹200" },
            { id: 4, name: "Metal Straw Set", img: straw, carbon: "0.2 kg CO₂e", price: "₹180" },
          ].map((item) => (
            <div key={item.id} style={{
              background: "#f9fff9",
              border: "1px solid #c8e6c9",
              borderRadius: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              padding: "15px",
              textAlign: "center"
            }}>
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <h4>{item.name}</h4>
              <p><b>Carbon:</b> {item.carbon}</p>
              <p><b>Price:</b> {item.price}</p>
              <button
                onClick={() => addToCart(item)} // ✅ Works now
                style={{
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 💚 Recommended Products (from Flask API) */}
      <section
        className="recommended-products"
        style={{
          background: "#f1f8f5",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2e7d32" }}>💚 Recommended for You</h2>
        {loading ? (
          <p style={{ fontSize: "16px", color: "#666" }}>Fetching personalized eco recommendations...</p>
        ) : recommendations.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              marginTop: "20px",
            }}
          >
            {recommendations.map((item) => (
              <div
                key={item.product_id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #c8e6c9",
                  borderRadius: "10px",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  padding: "15px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name || "Product"}
                  onError={(e) => {
                    if (e.target.src !== "https://via.placeholder.com/250x180?text=Product") {
                      e.target.src = "https://via.placeholder.com/250x180?text=Product";
                    }
                  }}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    backgroundColor: "#f5f5f5",
                  }}
                />
                <h4 style={{ marginTop: "10px", color: "#2e7d32" }}>
                  {item.name}
                </h4>
                <p><b>Price:</b> {item.price}</p>
                <p><b>Carbon:</b> {item.carbon}</p>
                <button
                  onClick={() => addToCart(item)}
                  style={{
                    backgroundColor: "#2e7d32",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            <p style={{ fontSize: "16px", color: "#666" }}>
              No recommendations available right now. Please check if the backend server is running.
            </p>
            <p style={{ fontSize: "14px", color: "#999", marginTop: "10px" }}>
              Make sure Flask backend is running on http://127.0.0.1:5000
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
