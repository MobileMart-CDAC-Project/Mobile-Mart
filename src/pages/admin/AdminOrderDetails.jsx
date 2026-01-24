// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../../utils/axiosInstance";
// import { toast } from "react-toastify";

// function AdminOrderDetails() {

//   const { id } = useParams();
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     axios.get(`/admin/orders/${id}`)
//       .then(res => setOrder(res.data))
//       .catch(() => toast.error("Failed to load order details"));
//   }, [id]);

//   if (!order) return <p className="text-center mt-4">Loading...</p>;

//   return (
//     <div className="container mt-4">

//       <h3>Order #{order.orderId}</h3>

//       <p><strong>User:</strong> {order.userEmail}</p>
//       <p><strong>Status:</strong> {order.status}</p>

//       <h5 className="mt-3">Items</h5>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Price</th>
//             <th>Qty</th>
//             <th>Total</th>
//           </tr>
//         </thead>

//         <tbody>
//           {order.items.map(item => (
//             <tr key={item.productId}>
//               <td>{item.productName}</td>
//               <td>₹{item.price}</td>
//               <td>{item.quantity}</td>
//               <td>₹{item.price * item.quantity}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h4>Total Amount: ₹{order.totalAmount}</h4>
//     </div>
//   );
// }

// export default AdminOrderDetails;






import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

function UserOrderDetails() {

  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/user/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => toast.error("Failed to load order details"));
  }, [id]);

  if (!order) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">

      <h3>Order #{order.orderId}</h3>

      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Order Date:</strong> {order.orderDate}</p>

      <h5 className="mt-3">Items</h5>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map(item => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="text-end">Total Amount: ₹{order.totalAmount}</h4>
    </div>
  );
}

export default UserOrderDetails;
