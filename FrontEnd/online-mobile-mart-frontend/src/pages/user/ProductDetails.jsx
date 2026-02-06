import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import LoginModal from "../../components/LoginModal";
import ProductComments from "../../components/ProductComments";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to load product";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error: {error}
          <br />
          <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Product not found
          <br />
          <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [];

  // ================= ADD TO CART =================
  const addToCart = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (role !== "USER") {
      toast.error("Only users can add to cart");
      return;
    }

    axios.post("/cart/add", {
      productId: product.productId,
      quantity: 1
    })
    .then(() => {
      toast.success("Product added to cart");
      window.dispatchEvent(new Event('cartUpdated'));
      navigate("/cart");
    })
    .catch(() => {
      toast.error("Failed to add to cart");
    });
  };

  // ================= BUY NOW =================
  const buyNow = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (role !== "USER") {
      toast.error("Only users can buy products");
      return;
    }

    setProcessingPayment(true);
    try {
      // Step 1: Add product to cart
      await axios.post("/cart/add", {
        productId: product.productId,
        quantity: 1
      });

      // Step 2: Create order
      const orderRes = await axios.post("/orders/place");
      const orderId = orderRes.data.orderId;
      const totalAmount = orderRes.data.totalAmount;

      // Step 3: Create Razorpay order
      const paymentRes = await axios.post(`/payments/create-order?amount=${Math.round(totalAmount)}&currency=INR`);
      const razorpayOrder = paymentRes.data;

      // Step 4: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_S7MbZ6kHqolSa0",
        amount: Math.round(totalAmount) * 100,
        currency: "INR",
        name: "MobileMart",
        description: "Mobile Phone Purchase",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 5: Verify payment
            await axios.post(`/transactions/pay/${orderId}`);
            toast.success("Payment successful!");
            
            // Step 6: Clear cart only after successful payment
            await axios.post(`/orders/${orderId}/confirm`);
            
            window.dispatchEvent(new Event("cartUpdated"));
            navigate("/order-success");
          } catch (error) {
            toast.error("Payment verification failed");
            console.error(error);
          }
        },
        prefill: {
          name: "Customer",
          email: localStorage.getItem("email") || "",
          contact: "9999999999",
        },
        theme: {
          color: "#007bff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Unknown error occurred";
      toast.error("Failed to process payment: " + errorMsg);
      console.error("Payment error:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <button 
        className="btn btn-outline-secondary mb-4" 
        onClick={() => navigate("/")}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <i className="fas fa-arrow-left"></i> Back to Products
      </button>

      <div className="row">
        {/* IMAGES SECTION */}
        <div className="col-lg-5 mb-4">
          <div className="bg-light rounded p-3" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/300"
                alt="placeholder"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>

          {/* THUMBNAIL IMAGES */}
          {images.length > 1 && (
            <div className="d-flex gap-2 mt-3" style={{ flexWrap: 'wrap' }}>
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  width="80"
                  height="80"
                  className="border rounded"
                  alt={`product-${index}`}
                  style={{
                    objectFit: 'contain',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO SECTION */}
        <div className="col-lg-7">
          <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a' }}>
            {product.name}
          </h1>

          {product.brand && (
            <p className="text-muted mb-3" style={{ fontSize: '1.1rem' }}>
              <strong>Brand:</strong> {product.brand}
            </p>
          )}

          {/* PRICE */}
          <div className="mb-4">
            <h2 className="text-success" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              ₹ {product.price.toLocaleString()}
            </h2>
          </div>

          {/* STOCK STATUS */}
          <div className="mb-4">
            <p style={{ fontSize: '1.1rem' }}>
              <strong>Stock:</strong>{' '}
              <span className={product.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} items available` : 'Out of Stock'}
              </span>
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <h5 className="mb-2">Description</h5>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
              {product.description}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
            {role !== "ADMIN" && product.stockQuantity > 0 && (
              <>
                <button
                  className="btn"
                  onClick={addToCart}
                  style={{
                    flex: '1',
                    minWidth: '150px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  <i className="fas fa-shopping-cart me-2"></i> Add to Cart
                </button>

                <button
                  className="btn"
                  onClick={buyNow}
                  disabled={processingPayment}
                  style={{
                    flex: '1',
                    minWidth: '150px',
                    backgroundColor: '#ff6b00',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: processingPayment ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: processingPayment ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => !processingPayment && (e.target.style.backgroundColor = '#e55a00')}
                  onMouseLeave={(e) => !processingPayment && (e.target.style.backgroundColor = '#ff6b00')}
                >
                  <i className="fas fa-bolt me-2"></i> {processingPayment ? 'Processing...' : 'Buy Now'}
                </button>
              </>
            )}
            
            {product.stockQuantity === 0 && role !== "ADMIN" && (
              <button className="btn btn-secondary" disabled style={{ flex: '1', minWidth: '150px', padding: '12px 24px', fontSize: '1rem' }}>
                Out of Stock
              </button>
            )}
          </div>

          {/* ADDITIONAL INFO */}
          <div className="border-top pt-4">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Product ID:</strong> {product.productId}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Category:</strong> {product.category || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* PRODUCT COMMENTS */}
      <div>
        <h3 className="mb-4">Customer Reviews</h3>
        <ProductComments productId={id} />
      </div>

      {/* LOGIN MODAL */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default ProductDetails;
