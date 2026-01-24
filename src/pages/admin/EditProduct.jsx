// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../utils/axiosInstance";
// import { toast } from "react-toastify";

// export default function EditProduct() {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "",
//     brand: "",
//     price: "",
//     stockQuantity: "",
//     description: "",
//     images: []
//   });

//   const [newImages, setNewImages] = useState([]);

//   // ================= LOAD PRODUCT =================
//   useEffect(() => {
//     axios.get(`/products/${id}`)
//       .then(res => setProduct(res.data))
//       .catch(() => toast.error("Failed to load product"));
//   }, [id]);

//   // ================= UPDATE FIELDS =================
//   const handleChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   // ================= UPDATE PRODUCT =================
//   const updateProduct = async () => {
//     try {
//       await axios.put(`/admin/products/${id}`, product);
//       toast.success("Product updated");
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   // ================= UPLOAD IMAGES =================
//  const uploadImages = async () => {
//   if (newImages.length === 0) {
//     toast.warning("Select images first");
//     return;
//   }

//   const formData = new FormData();
//   newImages.forEach(file => formData.append("files", file));

//   try {
//     await axios.post(
//       `/admin/products/${id}/images`,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     toast.success("Images uploaded");
//     window.location.reload();

//   } catch {
//     toast.error("Image upload failed");
//   }
// };



//   // ================= DELETE IMAGE =================
// //   const deleteImage = async (imageId) => {
// //     try {
// //       await axios.delete(`/admin/products/images/${imageId}`);
// //       setProduct({
// //         ...product,
// //         images: product.images.filter(i => i.id !== imageId)
// //       });
// //     } catch {
// //       toast.error("Failed to delete image");
// //     }
// //   };

//   return (
//     <div className="container mt-4 col-md-7">

//       <h3>Edit Product</h3>

//       {/* CLEAR LABELS */}
//       <label>Product Name</label>
//       <input className="form-control mb-2"
//         name="name"
//         value={product.name}
//         onChange={handleChange}
//       />

//       <label>Brand</label>
//       <input className="form-control mb-2"
//         name="brand"
//         value={product.brand}
//         onChange={handleChange}
//       />

//       <label>Price</label>
//       <input className="form-control mb-2"
//         type="number"
//         name="price"
//         value={product.price}
//         onChange={handleChange}
//       />

//       <label>Stock Quantity</label>
//       <input className="form-control mb-2"
//         type="number"
//         name="stockQuantity"
//         value={product.stockQuantity}
//         onChange={handleChange}
//       />

//       <label>Description</label>
//       <textarea className="form-control mb-3"
//         name="description"
//         value={product.description}
//         onChange={handleChange}
//       />

//       <button className="btn btn-primary w-100 mb-4"
//         onClick={updateProduct}>
//         Update Product Details
//       </button>

//       <hr />

//       {/* EXISTING IMAGES */}
//       <h5>Product Images</h5>
//       <div className="d-flex gap-3 flex-wrap mb-3">
//         {product.images.map(img => (
//          <div key={img.imageId} className="text-center">
//          <img src={img.imageUrl} width="120" />
//             <button
//             className="btn btn-danger btn-sm mt-1"
//             onClick={() => deleteImage(img.imageId)}
//          >
//            Delete
//          </button>
//         </div>
//         ))}
//       </div>

//       {/* ADD NEW IMAGES */}
//       <input type="file"
//         multiple
//         className="form-control mb-2"
//         onChange={e => setNewImages([...e.target.files])}
//       />

//       <button className="btn btn-secondary w-100"
//         onClick={uploadImages}>
//         Add New Images
//       </button>

//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function EditProduct() {

  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  // ======================
  // PRODUCT STATE (DTO + images)
  // ======================
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    stockQuantity: "",
    description: "",
    images: []
  });

  const [newImages, setNewImages] = useState([]);

  // ======================
  // LOAD PRODUCT
  // GET /api/products/{id}
  // ======================
  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  // ======================
  // HANDLE INPUT CHANGE
  // ======================
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  // ======================
  // UPDATE PRODUCT
  // PUT /api/admin/products/{id}
  // ======================
  const updateProduct = async () => {

    const payload = {
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: Number(product.price),
      stockQuantity: Number(product.stockQuantity)
    };

    try {
      setLoading(true);
      await axios.put(`/admin/products/${id}`, payload);
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UPLOAD IMAGES
  // POST /api/admin/products/{id}/images
  // ======================
  const uploadImages = async () => {
    if (newImages.length === 0) {
      toast.warning("Select images first");
      return;
    }

    const formData = new FormData();
    newImages.forEach(file => formData.append("files", file));

    try {
      await axios.post(
        `/admin/products/${id}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Images uploaded");

      // Reload product images only (React-safe)
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
      setNewImages([]);

    } catch {
      toast.error("Image upload failed");
    }
  };

  // ======================
  // DELETE IMAGE
  // DELETE /api/admin/products/{imageId}
  // ======================
  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`/admin/products/${imageId}`);
      toast.success("Image deleted");

      setProduct({
        ...product,
        images: product.images.filter(img => img.imageId !== imageId)
      });
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="container mt-4 col-md-7">

      <h3>Edit Product</h3>

      <label>Product Name</label>
      <input
        className="form-control mb-2"
        name="name"
        value={product.name}
        onChange={handleChange}
      />

      <label>Brand</label>
      <input
        className="form-control mb-2"
        name="brand"
        value={product.brand}
        onChange={handleChange}
      />

      <label>Price</label>
      <input
        className="form-control mb-2"
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
      />

      <label>Stock Quantity</label>
      <input
        className="form-control mb-2"
        type="number"
        name="stockQuantity"
        value={product.stockQuantity}
        onChange={handleChange}
      />

      <label>Description</label>
      <textarea
        className="form-control mb-3"
        name="description"
        value={product.description}
        onChange={handleChange}
      />

      <button
        className="btn btn-primary w-100 mb-4"
        onClick={updateProduct}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Product Details"}
      </button>

      <hr />

      {/* EXISTING IMAGES */}
      <h5>Product Images</h5>
      <div className="d-flex gap-3 flex-wrap mb-3">
        {product.images.map(img => (
          <div key={img.imageId} className="text-center">
            <img src={img.imageUrl} width="120" alt="" />
            <button
              className="btn btn-danger btn-sm mt-1"
              onClick={() => deleteImage(img.imageId)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ADD NEW IMAGES */}
      <input
        type="file"
        multiple
        className="form-control mb-2"
        onChange={e => setNewImages([...e.target.files])}
      />

      <button
        className="btn btn-secondary w-100"
        onClick={uploadImages}
      >
        Add New Images
      </button>

    </div>
  );
}
