// import { useState } from "react";
// import axios from "../../utils/axiosInstance";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function AddProduct() {

//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "",
//     brand: "",
//     price: "",
//     stockQuantity: "",
//     description: ""
//   });

//   const handleChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   const saveProduct = async () => {
//     try {
//       const res = await axios.post("/admin/products", product);
//       toast.success("Product created");

//       // 👉 redirect to edit page with productId
//       navigate(`/admin/products/edit/${res.data.productId}`);

//     } catch {
//       toast.error("Failed to create product");
//     }
//   };

//   return (
//     <div className="container mt-4 col-md-6">
//       <h3>Add New Product</h3>

//       <input className="form-control mb-2"
//         name="name"
//         placeholder="Product Name"
//         onChange={handleChange}
//       />

//       <input className="form-control mb-2"
//         name="brand"
//         placeholder="Brand Name"
//         onChange={handleChange}
//       />

//       <input className="form-control mb-2"
//         type="number"
//         name="price"
//         placeholder="Price"
//         onChange={handleChange}
//       />

//       <input className="form-control mb-2"
//         type="number"
//         name="stockQuantity"
//         placeholder="Stock Quantity"
//         onChange={handleChange}
//       />

//       <textarea className="form-control mb-3"
//         name="description"
//         placeholder="Description"
//         onChange={handleChange}
//       />

//       <button className="btn btn-success w-100" onClick={saveProduct}>
//         Save Product
//       </button>
//     </div>
//   );
// }





import { useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // DTO-aligned state
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    stockQuantity: "",
    description: ""
  });

  // =====================
  // HANDLE INPUT CHANGE
  // =====================
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  // =====================
  // SAVE PRODUCT
  // POST /api/admin/products
  // =====================
  const saveProduct = async () => {

    // ✅ Frontend validation (DTO-safe)
    if (
      !product.name ||
      !product.brand ||
      !product.price ||
      !product.stockQuantity
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    const payload = {
      ...product,
      price: Number(product.price),
      stockQuantity: Number(product.stockQuantity)
    };

    try {
      setLoading(true);

      const res = await axios.post("/admin/products", payload);
      toast.success("Product created successfully");

      // ✅ Redirect to edit page (for image upload)
      navigate(`/admin/products/edit/${res.data.productId}`);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 col-md-6">

      <h3>Add New Product</h3>

      <input
        className="form-control mb-2"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        name="brand"
        placeholder="Brand Name"
        value={product.brand}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        type="number"
        name="stockQuantity"
        placeholder="Stock Quantity"
        value={product.stockQuantity}
        onChange={handleChange}
      />

      <textarea
        className="form-control mb-3"
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
      />

      <button
        className="btn btn-success w-100"
        onClick={saveProduct}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Product"}
      </button>

    </div>
  );
}
