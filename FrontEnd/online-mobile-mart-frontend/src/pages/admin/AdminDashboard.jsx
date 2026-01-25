// import { useEffect, useState } from "react";
// import axios from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function AdminDashboard() {

//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

//   // =====================
//   // LOAD ADMIN PRODUCTS
//   // =====================
//   const loadProducts = async () => {
//     try {
//       const res = await axios.get("/admin/products");
//       setProducts(res.data);
//     } catch {
//       toast.error("Failed to load products");
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   // =====================
//   // DELETE PRODUCT
//   // =====================
//   const deleteProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) {
//       return;
//     }

//     try {
//       await axios.delete(`/admin/products/${id}`);
//       toast.success("Product deleted");
//       loadProducts();
//     } catch {
//       toast.error("Failed to delete product");
//     }
//   };

//   return (
//     <div className="container mt-4">

//       <div className="d-flex justify-content-between align-items-center">
//         <h3>Admin – Manage Products</h3>

//         <button
//           className="btn btn-success"
//           onClick={() => navigate("/admin/products/add")}
//         >
//           + Add Product
//         </button>
//       </div>

//       {products.length === 0 ? (
//         <p className="mt-3">No products found</p>
//       ) : (
//         <table className="table table-bordered table-hover mt-3">
//           <thead className="table-dark">
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Price</th>
//               <th>Stock</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map(product => (
//               <tr key={product.productId}>
//                 <td>{product.productId}</td>
//                 <td>{product.name}</td>
//                 <td>₹{product.price}</td>
//                 <td>{product.stockQuantity}</td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-primary me-2"
//                     onClick={() =>
//                       navigate(`/admin/products/edit/${product.productId}`)
//                     }
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => deleteProduct(product.productId)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSold: 0,
    revenue: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get("/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Load products error:", error);
      toast.error(`Failed to load products: ${error.response?.data?.message || error.message}`);
    }
  };

  const loadStats = async () => {
    try {
      const res = await axios.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Load stats error:", error);
      toast.error(`Failed to load stats: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      loadProducts();
      loadStats();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-4">

      <h3>My Brand Dashboard</h3>

      {/* ===== STATS ===== */}
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card p-3">
            <h6>Total Products</h6>
            <h4>{stats.totalProducts}</h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Total Sold</h6>
            <h4>{stats.totalSold}</h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Total Revenue</h6>
            <h4>₹ {stats.revenue}</h4>
          </div>
        </div>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="d-flex justify-content-between mt-4">
        <h4>My Products</h4>
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/products/add")}
        >
          + Add Product
        </button>
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sold</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.productId}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>{p.soldQuantity}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() =>
                    navigate(`/admin/products/edit/${p.productId}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(p.productId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

