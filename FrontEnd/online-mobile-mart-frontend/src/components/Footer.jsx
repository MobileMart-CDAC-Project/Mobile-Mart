import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1a1a1a",
        color: "#fff",
        padding: "40px 0",
        marginTop: "60px",
        borderTop: "1px solid #333"
      }}
    >
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Mobile Mart</h5>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#aaa" }}>
              Your trusted online marketplace for premium mobile devices and accessories.
              Quality products, competitive prices, and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Customer Service</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  Shipping Info
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                  onMouseLeave={(e) => (e.target.style.color = "#aaa")}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ borderColor: "#333", margin: "30px 0" }} />

        {/* Bottom Section */}
        <div className="row align-items-center">
          {/* Contact Info */}
          <div className="col-md-6">
            <div style={{ fontSize: "14px", color: "#aaa" }}>
              <p className="mb-1">
                <strong>Email:</strong> support@mobilemart.com
              </p>
              <p className="mb-0">
                <strong>Phone:</strong> +91 9422001955
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-md-6 text-md-end">
            <div style={{ fontSize: "16px" }}>
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#aaa",
                  marginRight: "15px",
                  textDecoration: "none",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                onMouseLeave={(e) => (e.target.style.color = "#aaa")}
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://twitter.com/onebyhalf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#aaa",
                  marginRight: "15px",
                  textDecoration: "none",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                onMouseLeave={(e) => (e.target.style.color = "#aaa")}
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com/onebyhalf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#aaa",
                  marginRight: "15px",
                  textDecoration: "none",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                onMouseLeave={(e) => (e.target.style.color = "#aaa")}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/rajvardhan-patil"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                onMouseLeave={(e) => (e.target.style.color = "#aaa")}
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #333",
            fontSize: "13px",
            color: "#666"
          }}
        >
          <p>
            &copy; 2026 Mobile Mart. All rights reserved. | Designed with
            <span style={{ color: "#10b981", marginLeft: "5px", marginRight: "5px" }}>
              ❤
            </span>
            for mobile enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
