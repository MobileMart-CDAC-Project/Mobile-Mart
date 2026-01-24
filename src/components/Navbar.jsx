import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

function Navbar() {

  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [cartCount, setCartCount] = useState(0);

  // 🔁 keep navbar in sync
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // 🛒 load cart count
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
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand" to="/">MobileMart</Link>

        <ul className="navbar-nav ms-auto">

          {/* USER CART */}
          {token && role === "USER" && (
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart 🛒
                {cartCount > 0 && (
                  <span className="badge bg-danger ms-1">{cartCount}</span>
                )}
              </Link>
            </li>
          )}

          {/* ADMIN */}
          {token && role === "ADMIN" && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin/products">
                Admin
              </Link>
            </li>
          )}

          {/* LOGIN / LOGOUT */}
          {!token ? (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          ) : (
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-light ms-2"
                      onClick={logout}>
                Logout
              </button>
            </li>
          )}

            {token && role === "ADMIN" && (
                <li className="nav-item">
                <Link className="nav-link" to="/admin/orders">
                  Orders
                 </Link>
                </li>
                )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
