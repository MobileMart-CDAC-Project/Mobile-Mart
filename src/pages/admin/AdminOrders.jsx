// import { useEffect, useState } from "react";
// import axios from "../../utils/axiosInstance";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// function AdminOrders() {

//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     axios.get("/admin/orders")
//       .then(res => setOrders(res.data))
//       .catch(() => toast.error("Failed to load orders"));
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h3>All Orders (Admin)</h3>

//       {orders.length === 0 ? (
//         <p>No orders found</p>
//       ) : (
//         <table className="table table-bordered mt-3">
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>User Email</th>
//               <th>Status</th>
//               <th>Total Amount</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map(order => (
//               <tr key={order.orderId}>
//                 <td>{order.orderId}</td>
//                 <td>{order.userEmail}</td>
//                 <td>{order.status}</td>
//                 <td>₹{order.totalAmount}</td>
//                 <td>
//                   <Link
//                     to={`/admin/orders/${order.orderId}`}
//                     className="btn btn-sm btn-primary"
//                   >
//                     View
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default AdminOrders;






import { useEffect, useState } from "react"; 
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD ALL ORDERS (ADMIN)
  // GET /api/admin/orders
  // ======================
  useEffect(() => {
    axios.get("/admin/orders")
      .then(res => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">

      <h3>All Orders (Admin)</h3>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="table table-bordered table-hover mt-3">
          <thead className="table-dark">
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
                    to={`/admin/orders/${order.orderId}`}
                    className="btn btn-sm btn-primary"
                  >
                    View Details
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

export default AdminOrders;
