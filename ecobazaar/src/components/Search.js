import React, { useState, useContext, useRef, useEffect } from "react";
import { CartContext } from "../CartContext";
import { getProductImageFromObject } from "../utils/productImages";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef(null);
  const { addToCart } = useContext(CartContext);

  // Use asset images for products
  const getImageForProduct = (item) => {
    return getProductImageFromObject(item);
  };

  // Search function using chatbot API
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: searchQuery, top_n: 10 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform recommendations to match our format with asset images
      const formattedResults = (data.recommendations || []).map((item) => ({
        ...item,
        image: getProductImageFromObject(item),
        price: item.price ? (typeof item.price === 'string' ? item.price : `₹${item.price}`) : '₹0',
        carbon: item.carbon_footprint ? `${item.carbon_footprint} kg CO₂e` : '0 kg CO₂e',
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Failed to search products. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search - search after user stops typing for 500ms
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 500);
    } else {
      setResults([]);
      setHasSearched(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      performSearch(query);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>🔍 Search Eco-Friendly Products</h2>
      
      <div style={{ position: "relative", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search by name, category, or description... (e.g., 'kitchen products', 'hygiene items', 'reusable items')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            padding: "15px 20px",
            width: "100%",
            borderRadius: "8px",
            border: "2px solid #c8e6c9",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
          onBlur={(e) => (e.target.style.borderColor = "#c8e6c9")}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#2e7d32",
            }}
          >
            🔄 Searching...
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "15px",
            background: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {!hasSearched && !loading && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#666",
            background: "#f9fff9",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            🌿 Start typing to search for eco-friendly products
          </p>
          <p style={{ fontSize: "14px", color: "#999" }}>
            Try searching for: "kitchen products", "hygiene items", "reusable items", or any product description
          </p>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#666",
            background: "#f9fff9",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontSize: "18px" }}>🔍 No products found</p>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "10px" }}>
            Try different keywords or browse our product catalog
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 style={{ color: "#2e7d32", marginBottom: "20px" }}>
            Found {results.length} product{results.length !== 1 ? "s" : ""}
          </h3>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
          >
            {results.map((item) => (
              <div
                key={item.product_id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #c8e6c9",
                  borderRadius: "10px",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  padding: "15px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
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
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/250x180?text=Product";
                  }}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    backgroundColor: "#f5f5f5",
                    marginBottom: "10px",
                  }}
                />
                <h4 style={{ marginTop: "10px", color: "#2e7d32", marginBottom: "8px" }}>
                  {item.name}
                </h4>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                  <b>Category:</b> {item.category}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <b>Price:</b> {item.price}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#2e7d32" }}>
                  <b>Carbon:</b> {item.carbon}
                </p>
                <button
                  onClick={() => addToCart(item)}
                  style={{
                    width: "100%",
                    backgroundColor: "#2e7d32",
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
        </div>
      )}
    </div>
  );
}
