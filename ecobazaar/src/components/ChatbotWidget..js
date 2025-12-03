import React, { useState, useContext, useMemo, useCallback } from "react";
import { CartContext } from "../CartContext";
import { getProductImageFromObject } from "../utils/productImages";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  // Use asset images for products
  const getImageForProduct = (item) => {
    return getProductImageFromObject(item);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { from: "user", text: message };
    setResponses((prev) => [...prev, userMsg]);
    setLoading(true);
    const currentMessage = message;
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage, top_n: 5 }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      // Memoize product transformation to prevent re-renders
      const transformedProducts = (data.recommendations || []).map((p) => ({
        ...p,
        product_id: p.product_id, // Ensure product_id is preserved
        image: getProductImageFromObject(p),
        price: p.price ? (typeof p.price === 'string' ? p.price : `₹${p.price}`) : '₹0',
      }));
      
      const botMsg = {
        from: "bot",
        response: data.response,
        products: transformedProducts,
        timestamp: Date.now(), // Add timestamp for unique key
      };
      setResponses((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMsg = {
        from: "bot",
        response: "Sorry, I couldn't process your request. Please try again.",
        products: [],
      };
      setResponses((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#2e7d32",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 2000,
        }}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "330px",
            height: "420px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #c8e6c9",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 2000,
          }}
        >
          <div style={{ padding: "10px", background: "#2e7d32", color: "white" }}>
            🌿 EcoBuddy Chat
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              fontSize: "0.9rem",
            }}
          >
            {responses.length === 0 && (
              <div style={{ color: "#666", textAlign: "center", padding: "20px" }}>
                <p>👋 Hi! I'm EcoBuddy, your eco-friendly shopping assistant.</p>
                <p style={{ fontSize: "0.85rem", marginTop: "10px" }}>
                  Ask me about products like:<br />
                  "kitchen products", "hygiene items",<br />
                  or "reusable items"
                </p>
              </div>
            )}
            {responses.map((msg, i) => (
              <div key={`${msg.from}-${i}-${msg.timestamp || i}`} style={{ marginBottom: "15px" }}>
                {msg.from === "user" ? (
                  <div
                    style={{
                      textAlign: "right",
                      background: "#e8f5e9",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      display: "inline-block",
                      maxWidth: "80%",
                      marginLeft: "20%",
                    }}
                  >
                    <b>You:</b> {msg.text}
                  </div>
                ) : (
                  <div>
                    {msg.products && msg.products.length > 0 ? (
                      <div style={{ marginTop: "8px" }}>
                        {msg.products.map((p) => (
                          <div
                            key={`product-${p.product_id}-${msg.timestamp || i}`}
                            style={{
                              border: "1px solid #c8e6c9",
                              borderRadius: "8px",
                              padding: "8px",
                              marginBottom: "8px",
                              background: "#ffffff",
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px" }}>
                              {/* Product Name Badge instead of Image */}
                              <div
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "6px",
                                  background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "0.7rem",
                                  textAlign: "center",
                                  padding: "5px",
                                  flexShrink: 0,
                                }}
                              >
                                {p.name ? p.name.substring(0, 3).toUpperCase() : "PRO"}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div 
                                  style={{ 
                                    fontWeight: "bold", 
                                    fontSize: "0.9rem",
                                    wordBreak: "break-word",
                                    lineHeight: "1.2",
                                    color: "#2e7d32",
                                  }}
                                >
                                  {p.name || "Product"}
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>
                                  {p.category || ""}
                                </div>
                                <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                                  <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                                    {p.price || "₹0"}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const productToAdd = {
                                      id: p.product_id,
                                      name: p.name,
                                      price: p.price,
                                      carbon: p.carbon_footprint ? `${p.carbon_footprint} kg CO₂e` : "0 kg CO₂e",
                                      image: p.image,
                                      qty: 1,
                                    };
                                    addToCart(productToAdd);
                                  }}
                                  style={{
                                    marginTop: "4px",
                                    padding: "4px 8px",
                                    fontSize: "0.75rem",
                                    background: "#2e7d32",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "#f1f8f5",
                          padding: "8px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        <b>🌿 EcoBuddy:</b> {msg.response || "No products found. Try a different search."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: "center", color: "#666", padding: "10px" }}>
                <div>🔄 Searching...</div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", padding: "8px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendMessage();
                }
              }}
              disabled={loading}
              style={{
                flex: 1,
                border: "1px solid #a5d6a7",
                padding: "8px",
                borderRadius: "6px",
                outline: "none",
              }}
              placeholder="Ask about eco-friendly products..."
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              style={{
                marginLeft: "6px",
                background: loading || !message.trim() ? "#ccc" : "#2e7d32",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: loading || !message.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}


