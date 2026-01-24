import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders/my")
      .then(res => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"));
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Orders</h3>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.status}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <Link
                    className="btn btn-sm btn-primary"
                    to={`/orders/${order.orderId}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyOrders;
