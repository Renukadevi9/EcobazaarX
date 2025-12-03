import React, { useContext, useMemo } from "react";
import { CartContext } from "../CartContext";

export default function SmartCart() {
  const { cart, orders, removeFromCart, updateQuantity, placeOrder, calculateTotal } = useContext(CartContext);

  // Calculate total cost
  const total = useMemo(() => {
    return calculateTotal(cart);
  }, [cart, calculateTotal]);

  // Calculate item count
  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }, [cart]);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#2e7d32", marginBottom: "30px" }}>🛒 Your Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          background: "#f9fff9",
          borderRadius: "10px",
        }}>
          <p style={{ fontSize: "18px", color: "#666" }}>Your cart is empty.</p>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "10px" }}>
            Start adding eco-friendly products to your cart!
          </p>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div style={{ 
            background: "#ffffff",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}>
            {cart.map((item, index) => {
              const itemPrice = typeof item.price === 'string' 
                ? parseInt(item.price.replace("₹", "").replace(",", "")) 
                : item.price || 0;
              const itemTotal = itemPrice * (item.qty || 1);

              return (
                <div
                  key={`${item.id || item.name}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: index < cart.length - 1 ? "1px solid #e0e0e0" : "none",
                    padding: "20px 0",
                    gap: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1 }}>
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80x80?text=Product";
                      }}
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        borderRadius: "8px",
                        objectFit: "cover",
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#2e7d32" }}>{item.name}</h4>
                      {item.carbon && (
                        <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
                          🌱 {item.carbon}
                        </p>
                      )}
                      <p style={{ margin: "4px 0", fontSize: "16px", fontWeight: "bold", color: "#2e7d32" }}>
                        {item.price || "₹0"}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* Quantity Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        onClick={() => updateQuantity(index, (item.qty || 1) - 1)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "6px",
                          border: "1px solid #c8e6c9",
                          background: "#ffffff",
                          cursor: "pointer",
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span style={{ 
                        minWidth: "30px", 
                        textAlign: "center",
                        fontWeight: "bold",
                      }}>
                        {item.qty || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, (item.qty || 1) + 1)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "6px",
                          border: "1px solid #c8e6c9",
                          background: "#ffffff",
                          cursor: "pointer",
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <div style={{ minWidth: "100px", textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                        ₹{itemTotal.toLocaleString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{
                        backgroundColor: "#c62828",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div style={{
            background: "#f1f8f5",
            borderRadius: "10px",
            padding: "25px",
            marginBottom: "30px",
          }}>
            <h3 style={{ color: "#2e7d32", marginTop: 0, marginBottom: "20px" }}>
              Order Summary
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Items ({itemCount}):</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ 
              borderTop: "2px solid #c8e6c9", 
              marginTop: "15px", 
              paddingTop: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <h3 style={{ margin: 0, color: "#2e7d32", fontSize: "24px" }}>
                Total:
              </h3>
              <h3 style={{ margin: 0, color: "#2e7d32", fontSize: "24px" }}>
                ₹{total.toLocaleString()}
              </h3>
            </div>
            <button
              onClick={placeOrder}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b5e20")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2e7d32")}
            >
              🛒 Place Order
            </button>
          </div>
        </div>
      )}

      {/* Order History */}
      {orders.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>📦 Order History</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #c8e6c9",
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "15px",
                  paddingBottom: "15px",
                  borderBottom: "1px solid #e0e0e0",
                }}>
                  <div>
                    <h4 style={{ margin: 0, color: "#2e7d32" }}>Order #{order.id}</h4>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
                      {order.date}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#2e7d32" }}>
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px",
                        background: "#f9fff9",
                        borderRadius: "6px",
                      }}
                    >
                      <img
                        src={item.image || item.img}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/50x50?text=Product";
                        }}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "6px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#666" }}>
                          Qty: {item.qty || 1} × {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
