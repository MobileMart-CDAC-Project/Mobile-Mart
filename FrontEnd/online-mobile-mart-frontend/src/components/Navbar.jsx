import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../cssStyles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    const handleCartUpdate = () => {
      if (token && role === "USER") {
        axios.get("/cart")
          .then(res => setCartCount(res.data.items.length))
          .catch(() => setCartCount(0));
      }
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("authChanged", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("authChanged", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (token && role === "USER") {
      axios.get("/cart")
        .then(res => setCartCount(res.data.items.length))
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [token, role]);

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top mobilemart-navbar">
      <div className="container">
        {/* BRAND */}
        <Link className="navbar-brand brand-logo" to="/">
          <img src="/images/icons/logo.png" alt="Logo" className="logo-img" />
          MobileMart
        </Link>

        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* USER */}
            {token && role === "USER" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/profile">
                  👤 Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link nav-hover position-relative" to="/cart">
                  🛒 Cart
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN */}
            {token && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/admin/products">
                  ⚙️ Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/admin/orders">
                    Orders
                  </Link>
                </li>
              </>
            )}

            {/* LOGIN / LOGOUT */}
            {!token ? (
              <li className="nav-item">
                <Link className="nav-link login-btn" to="/login">
                🔐 Login
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn logout-btn ms-2" onClick={logout}>
                🚪 Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
