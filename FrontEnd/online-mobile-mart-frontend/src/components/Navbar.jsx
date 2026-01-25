import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

function Navbar() {

  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [cartCount, setCartCount] = useState(0);

  
  useEffect(() => {
    const syncAuth = () => {
      const currentToken = localStorage.getItem("token");
      const currentRole = localStorage.getItem("role");
      console.log("Navbar auth sync - Token:", currentToken, "Role:", currentRole);
      setToken(currentToken);
      setRole(currentRole);
    };

    // Listen for cart updates
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

  //  load cart count
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
    <>
      {console.log("Navbar render - Token:", token, "Role:", role)}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            fontSize: '1.5rem',
            background: 'linear-gradient(45deg, #fff, #f8f9fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          📱 MobileMart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* USER */}
            {token && role === "USER" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    style={{
                      transition: 'all 0.3s ease',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      margin: '0 0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    👤 Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link position-relative"
                    to="/cart"
                    style={{
                      transition: 'all 0.3s ease',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      margin: '0 0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🛒 Cart
                    {cartCount > 0 && (
                      <span
                        className="badge ms-2"
                        style={{
                          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN */}
            {token && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/admin/products"
                    style={{
                      transition: 'all 0.3s ease',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      margin: '0 0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ⚙️ Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/admin/orders"
                    style={{
                      transition: 'all 0.3s ease',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      margin: '0 0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📋 Orders
                  </Link>
                </li>
              </>
            )}

            {/* LOGIN / LOGOUT */}
            {!token ? (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  style={{
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    margin: '0 0.25rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🔐 Login
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  className="btn ms-2"
                  onClick={logout}
                  style={{
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🚪 Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .badge {
          animation: pulse 2s infinite;
        }
      `}</style>
    </nav>
    </>
  );
}

export default Navbar;
