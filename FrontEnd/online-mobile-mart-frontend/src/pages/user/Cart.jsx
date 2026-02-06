import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {

  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // =====================
  // LOAD CART
  // =====================
  const loadCart = async () => {
    try {
      const res = await axios.get("/cart");
      setCart(res.data);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // =====================
  // UPDATE QUANTITY
  // =====================
 const updateQty = async (productId, newQty) => {
  if (newQty < 1) return;

  try {
    await axios.put("/cart/update", {
      productId:productId,
      quantity: newQty
    });
    loadCart(); // refresh cart
    window.dispatchEvent(new Event('cartUpdated')); // notify navbar
  } catch {
    toast.error("Failed to update quantity");
  }
};


  // =====================
  // REMOVE ITEM
  // =====================
  const removeItem = async (productId) => {
    try {
      await axios.put("/cart/update", {
        productId: productId,
        quantity: 0
      });
      loadCart();
      window.dispatchEvent(new Event('cartUpdated')); // notify navbar
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // =====================
  // PLACE ORDER WITH RAZORPAY
  // =====================
  const placeOrder = async () => {
    if (cart.totalAmount === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order in backend
      const orderRes = await axios.post("/orders/place");
      const orderId = orderRes.data.orderId;
      toast.success("Order created!");

      // Step 2: Create Razorpay order
      const paymentRes = await axios.post(
        `/payments/create-order?amount=${Math.round(cart.totalAmount)}&currency=INR`
      );
      const razorpayOrder = paymentRes.data;

      // Step 3: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_S7MbZ6kHqolSa0",
        amount: Math.round(cart.totalAmount) * 100,
        currency: "INR",
        name: "MobileMart",
        description: "Mobile Phone Purchase",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 4: Verify payment and create transaction
            const txRes = await axios.post(`/transactions/pay/${orderId}`);
            toast.success("Payment successful!");
            
            // Step 5: Clear cart only after successful payment
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
      setLoading(false);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="container mt-4">

      <h3>Your Cart</h3>

      {cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.items.map(item => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>₹{item.price}</td>
                  <td>
                <button
                     className="btn btn-sm btn-secondary me-1"
                     onClick={() => updateQty(item.productId, item.quantity - 1)}
                    >
                    −   
            </button>

            <span className="mx-2">{item.quantity}</span>

            <button
                 className="btn btn-sm btn-secondary ms-1"
                 onClick={() => updateQty(item.productId, item.quantity + 1)}
            >
                +
                </button>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Total Amount: ₹{cart.totalAmount}</h4>

          <button
            className="btn btn-success mt-3"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
