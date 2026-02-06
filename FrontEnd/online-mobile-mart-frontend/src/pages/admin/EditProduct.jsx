import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import ImageUpload from "../../components/ImageUpload";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    stockQuantity: "",
    description: "",
    isActive: true,
    images: []
  });

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  // ================= UPDATE FIELDS =================
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ================= UPDATE PRODUCT =================
  const updateProduct = async () => {
    try {
      await axios.put(`/admin/products/${id}`, product);
      toast.success("Product updated");
    } catch {
      toast.error("Update failed");
    }
  };

  // ================= UPLOAD IMAGES =================
  const handleImageUploadSuccess = (uploadedImages) => {
    // Refresh product data to show new images
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Failed to refresh product images"));
  };



  // ================= DELETE IMAGE =================
  const deleteImage = async (imageUrl) => {
    try {
      // Extract filename from URL to identify the image
      const filename = imageUrl.split('/').pop();
      await axios.delete(`/admin/images/${filename}`);
      setProduct({
        ...product,
        images: product.images.filter(i => i !== imageUrl)
      });
      toast.success("Image deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  return (
    <div className="container mt-4 col-md-7">

      <h3>Edit Product</h3>

      {/* CLEAR LABELS */}
      <label>Product Name</label>
      <input className="form-control mb-2"
        name="name"
        value={product.name}
        onChange={handleChange}
      />

      <label>Brand</label>
      <input className="form-control mb-2"
        name="brand"
        value={product.brand}
        onChange={handleChange}
      />

      <label>Price</label>
      <input className="form-control mb-2"
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
      />

      <label>Stock Quantity</label>
      <input className="form-control mb-2"
        type="number"
        name="stockQuantity"
        value={product.stockQuantity}
        onChange={handleChange}
      />

      <label>Description</label>
      <textarea className="form-control mb-3"
        name="description"
        value={product.description}
        onChange={handleChange}
      />

      <label>Active Status</label>
      <select className="form-control mb-3"
        name="isActive"
        value={product.isActive}
        onChange={handleChange}
      >
        <option value={true}>Active</option>
        <option value={false}>Inactive</option>
      </select>

      <button className="btn btn-primary w-100 mb-4"
        onClick={updateProduct}>
        Update Product Details
      </button>

      <hr />

      {/* EXISTING IMAGES */}
      <h5>Current Product Images</h5>
      <div className="d-flex gap-3 flex-wrap mb-3">
        {product.images && product.images.length > 0 ? (
          product.images.map((img, index) => (
            <div key={index} className="text-center">
              <img src={img} width="120" className="img-thumbnail" alt="product" />
              <button
                className="btn btn-danger btn-sm mt-1"
                onClick={() => deleteImage(img)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted">No images yet</p>
        )}
      </div>

      <hr />

      {/* UPLOAD NEW IMAGES */}
      <h5>Upload New Images</h5>
      <ImageUpload
        productId={id}
        onUploadSuccess={handleImageUploadSuccess}
      />

    </div>
  );
}
