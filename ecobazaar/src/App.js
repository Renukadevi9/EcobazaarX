import React, { useState, useEffect, useContext } from "react";
import "./App.css";

// 🌿 Components
import HomePage from "./components/HomePage";
import ProductCatalog from "./components/ProductCatalog";
import CarbonPoints from "./components/CarbonPoints";
import CarbonInsights from "./components/CarbonInsights";
import SmartCart from "./components/SmartCart";
import Search from "./components/Search";
import Login from "./components/Login";
import ChatbotWidget from "./components/ChatbotWidget.";

// 🛒 Context
import { CartProvider, CartContext } from "./CartContext";

function Navbar({ active, setActive, role, handleLogout }) {
  const { cart } = useContext(CartContext);

  return (
    <header className="navbar">
      <div className="logo">🌿 EcoBazaar ({role})</div>
      <nav className="nav">

        {role === "User" && (
          <>
            <button onClick={() => setActive("home")}>Home</button>
            <button onClick={() => setActive("catalog")}>Product Catalog</button>
            <button onClick={() => setActive("points")}>Carbon Points</button>
            <button onClick={() => setActive("insights")}>Carbon Insights</button>
            <button onClick={() => setActive("cart")}>Smart Cart ({cart.length})</button>
            <button onClick={() => setActive("search")}>Search</button>
          </>
        )}

        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

function App() {
  const [active, setActive] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedPage = localStorage.getItem("activePage");
    const savedLogin = localStorage.getItem("isLoggedIn") === "true";
    const savedRole = localStorage.getItem("role");

    if (savedPage) setActive(savedPage);
    if (savedLogin && savedRole) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activePage", active);
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("role", role);
  }, [active, isLoggedIn, role]);

  const handleLoginSuccess = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    setActive("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("");
    localStorage.clear();
  };

  const renderContent = () => {
    switch (active) {
      case "catalog":
        return <ProductCatalog />;
      case "points":
        return <CarbonPoints />;
      case "insights":
        return <CarbonInsights />;
      case "cart":
        return <SmartCart />;
      case "search":
        return <Search />;
      default:
        return <HomePage />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <CartProvider>
      <div className="App">
        <Navbar
          active={active}
          setActive={setActive}
          role={role}
          handleLogout={handleLogout}
        />
        <main className="content">{renderContent()}</main>

        <footer className="footer">
          <p>© 2025 EcoBazaar. All rights reserved.</p>
        </footer>
        
        {/* 💬 Chatbot Widget - Available on all pages */}
        {isLoggedIn && <ChatbotWidget />}
      </div>
    </CartProvider>
  );
}

export default App;
