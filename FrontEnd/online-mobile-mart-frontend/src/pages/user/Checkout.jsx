import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

function Checkout() {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data);
    } catch {
      toast.error("Failed to load cart");
      navigate("/cart");
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const orderResponse = await axiosInstance.post("/payments/create-order", {
        amount: cart.totalAmount * 100, // Razorpay expects amount in paisa
        currency: "INR"
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
        amount: cart.totalAmount * 100,
        currency: "INR",
        name: "Mobile Mart",
        description: "Purchase from Mobile Mart",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            // Verify payment and place order
            const verifyResponse = await axiosInstance.post("/payments/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success("Payment successful! Order placed.");
            window.dispatchEvent(new Event('cartUpdated'));
            navigate("/order-success", { state: { orderId: verifyResponse.data.orderId } });
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to initiate payment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Your cart is empty</h3>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Checkout</h3>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              {cart.items.map(item => (
                <div key={item.productId} className="d-flex justify-content-between mb-2">
                  <span>{item.productName} (x{item.quantity})</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total Amount:</strong>
                <strong>₹{cart.totalAmount}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Payment</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-success w-100"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : `Pay ₹${cart.totalAmount}`}
              </button>
              <p className="text-muted mt-2 small">
                You will be redirected to Razorpay secure payment gateway
              </p>
            </div>
          </div>

          <button
            className="btn btn-outline-secondary w-100 mt-2"
            onClick={() => navigate("/cart")}
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;