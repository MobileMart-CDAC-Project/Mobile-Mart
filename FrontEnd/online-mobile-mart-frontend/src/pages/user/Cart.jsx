import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {

  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const navigate = useNavigate();

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
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
