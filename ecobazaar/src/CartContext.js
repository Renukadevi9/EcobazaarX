// src/CartContext.js
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); // Order history

  // ✅ Load from localStorage when app starts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setCart(savedCart);
    setOrders(savedOrders);
  }, []);

  // ✅ Save cart to localStorage on update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Save orders to localStorage on update
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // ✅ Add to cart (with quantity handling)
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id || item.name === product.name
      );
      
      if (existingIndex >= 0) {
        // Increment quantity if product exists
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qty: (updatedCart[existingIndex].qty || 1) + 1,
        };
        return updatedCart;
      } else {
        // Add new product with quantity 1
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  // ✅ Remove from cart
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // ✅ Update quantity
  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index] = { ...updatedCart[index], qty: newQty };
      return updatedCart;
    });
  };

  // ✅ Place order (move cart to orders)
  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const order = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: [...cart],
      total: calculateTotal(cart),
    };
    
    setOrders((prevOrders) => [...prevOrders, order]);
    setCart([]); // Clear cart after placing order
  };

  // ✅ Calculate total
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const price = typeof item.price === 'string' 
        ? parseInt(item.price.replace("₹", "").replace(",", "")) 
        : item.price || 0;
      const qty = item.qty || 1;
      return sum + (price * qty);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      orders,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      placeOrder,
      calculateTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};
