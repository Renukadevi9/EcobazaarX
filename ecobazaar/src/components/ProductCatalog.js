import React, { useContext, useState, useRef, useMemo, useCallback } from "react";
import { CartContext } from "../CartContext";

// 🌿 Import images
import bamboo from "../assets/bamboo-toothbrush.jpg";
import bottle from "../assets/water-bottle.jpg";
import bag from "../assets/cotton-bag.jpg";
import straw from "../assets/metal-straw.jpg";
import soap from "../assets/organic-soap.jpg";
import cup from "../assets/reusable-cup.jpg";
import plate from "../assets/eco-plates.jpg";
import shampoo from "../assets/herbal-shampoo.jpg";
import cleaner from "../assets/bio-cleaner.jpg";
import notebook from "../assets/recycled-notebook.jpg";
import { getProductImageFromObject } from "../utils/productImages";

// 🌿 ML Recommendation Component
const Recommendations = React.memo(function Recommendations({ productId }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const hasFetched = useRef(false);
  const lastProductId = useRef(null);

  // Use asset images for recommendations
  const getImageForProduct = useCallback((item) => {
    return getProductImageFromObject(item);
  }, []);

  React.useEffect(() => {
    // Prevent re-fetching if productId hasn't changed
    if (productId === lastProductId.current && hasFetched.current) {
      return;
    }

    if (!productId) {
      setRecs([]);
      setError(null);
      setLoading(false);
      hasFetched.current = false;
      lastProductId.current = null;
      return;
    }

    // Mark that we're fetching for this productId
    lastProductId.current = productId;
    hasFetched.current = true;

    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setRecs(data.recommendations || []);
      })
      .catch((err) => {
        console.error("❌ Recommendation Error:", err);
        setError(err.message || "Failed to load recommendations");
        setRecs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (!productId) return null;

  return (
    <div 
      style={{ 
        marginTop: "40px", 
        padding: "20px", 
        background: "#f1f8f5", 
        borderRadius: "10px",
        minHeight: "200px", // Prevent layout shift
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#2e7d32", margin: 0 }}>
          🌱 Similar Products Recommended for You
        </h2>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>🔄 Loading recommendations...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: "15px", 
          background: "#ffebee", 
          color: "#c62828", 
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && recs.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>No recommendations found for this product.</p>
        </div>
      )}

      {!loading && recs.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
          }}
        >
          {recs.map((item) => (
            <div
              key={item.product_id}
              style={{
                border: "1px solid #c8e6c9",
                padding: "15px",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={getImageForProduct(item)}
                alt={item.name}
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
                  borderRadius: "10px",
                  backgroundColor: "#f5f5f5",
                  marginBottom: "10px",
                  display: "block", // Prevent inline spacing issues
                }}
              />
              <h4 style={{ color: "#2e7d32", marginBottom: "8px" }}>{item.name}</h4>
              <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                <b>Category:</b> {item.category}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <b>Price:</b> ₹{item.price}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px", color: "#2e7d32" }}>
                <b>Carbon:</b> {item.carbon_footprint} kg CO₂e
              </p>
              <button
                onClick={() => {
                  const productToAdd = {
                    id: item.product_id,
                    name: item.name,
                    price: `₹${item.price}`,
                    carbon: `${item.carbon_footprint} kg CO₂e`,
                    image: getImageForProduct(item),
                  };
                  addToCart(productToAdd);
                }}
                style={{
                  width: "100%",
                  background: "#2e7d32",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b5e20")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2e7d32")}
              >
                🛒 Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// 🌿 Your product list
const products = [
  { id: 1, name: "Bamboo Toothbrush", image: bamboo, carbon: "0.3 kg CO₂e", price: "₹120" },
  { id: 2, name: "Reusable Water Bottle", image: bottle, carbon: "0.8 kg CO₂e", price: "₹350" },
  { id: 3, name: "Organic Cotton Bag", image: bag, carbon: "0.5 kg CO₂e", price: "₹200" },
  { id: 4, name: "Stainless Steel Straw Set", image: straw, carbon: "0.2 kg CO₂e", price: "₹180" },
  { id: 5, name: "Organic Handmade Soap", image: soap, carbon: "0.4 kg CO₂e", price: "₹150" },
  { id: 6, name: "Reusable Coffee Cup", image: cup, carbon: "0.7 kg CO₂e", price: "₹250" },
  { id: 7, name: "Eco-Friendly Areca Plates (Pack of 10)", image: plate, carbon: "0.6 kg CO₂e", price: "₹220" },
  { id: 8, name: "Herbal Shampoo Bar", image: shampoo, carbon: "0.3 kg CO₂e", price: "₹180" },
  { id: 9, name: "Bio Enzyme Surface Cleaner", image: cleaner, carbon: "0.4 kg CO₂e", price: "₹210" },
  { id: 10, name: "Recycled Paper Notebook", image: notebook, carbon: "0.2 kg CO₂e", price: "₹120" },
];

export default function ProductCatalog() {
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Memoize the toggle function to prevent unnecessary re-renders
  const handleRecommendToggle = useCallback((productId) => {
    setSelectedProduct(prev => prev === productId ? null : productId);
  }, []);

  return (
    <div>
      <h2>🌿 Eco-Friendly Product Catalog</h2>
      <p>Explore sustainable, low-carbon products.</p>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="product-card"
            style={{
              border: "1px solid #c8e6c9",
              padding: "15px",
              borderRadius: "10px",
              background: "#f9fff9",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "0.3s",
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

            <h4>{p.name}</h4>
            <p><b>Carbon Footprint:</b> {p.carbon}</p>
            <p><b>Price:</b> {p.price}</p>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(p)}
              style={{
                background: "#2e7d32",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Add to Cart
            </button>

            {/* Recommend Button */}
            <button
              onClick={() => handleRecommendToggle(p.id)}
              style={{
                background: selectedProduct === p.id ? "#01579b" : "#0277bd",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {selectedProduct === p.id ? "Hide Recommendations" : "Recommend Similar"}
            </button>
          </div>
        ))}
      </div>

      {/* Show ML Recommendations */}
      {selectedProduct && (
        <Recommendations 
          key={selectedProduct} 
          productId={selectedProduct} 
        />
      )}
    </div>
  );
}
