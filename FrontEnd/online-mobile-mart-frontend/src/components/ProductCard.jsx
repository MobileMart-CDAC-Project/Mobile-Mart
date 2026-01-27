import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import LoginModal from "./LoginModal";

function ProductCard({ product, isFavorite = false, onToggleFavorite }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/300";

  const addToCart = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (role !== "USER") {
      toast.error("Only users can add to cart");
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post("/cart/add", {
        productId: product.productId,
        quantity: 1
      });
      toast.success("Product added to cart");
      window.dispatchEvent(new Event('cartUpdated')); // notify navbar
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="product-card" style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      height: '100%',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}>
      {/* Product Image */}
      <div className="product-image" style={{
        position: 'relative',
        overflow: 'hidden',
        height: '220px',
        background: '#f8f9fa'
      }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />

        {/* Wishlist Button */}
        <button
          className="wishlist-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleFavorite) {
              onToggleFavorite(product.productId);
            }
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <i className={`fas fa-heart ${isFavorite ? 'text-danger' : 'text-muted'}`}
             style={{ fontSize: '16px' }}></i>
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info" style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 220px)'
      }}>
        <h3 className="product-title" style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '0 0 8px 0',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {product.name}
        </h3>

        <div className="product-price" style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#e53e3e',
          marginBottom: '16px'
        }}>
          ₹{product.price.toLocaleString()}
        </div>

        {/* Action Buttons */}
        <div className="product-actions" style={{
          marginTop: 'auto',
          display: 'flex',
          gap: '8px'
        }}>
          <Link
            to={`/product/${product.productId}`}
            className="btn btn-outline-primary"
            style={{
              flex: 1,
              border: '1px solid #10b981',
              color: '#10b981',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '36px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#10b981';
            }}
          >
            View Details
          </Link>
          <button
            className="btn btn-primary"
            onClick={addToCart}
            disabled={addingToCart}
            style={{
              flex: 1,
              backgroundColor: '#10b981',
              border: '1px solid #10b981',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              height: '36px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default ProductCard;
