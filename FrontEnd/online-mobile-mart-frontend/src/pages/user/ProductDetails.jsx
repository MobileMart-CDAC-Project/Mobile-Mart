import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import LoginModal from "../../components/LoginModal";
import ProductComments from "../../components/ProductComments";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [product, setProduct] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  if (!product) {
    return <div className="container mt-4">Loading...</div>;
  }

  const images = product.images || [];

  // ================= ADD TO CART =================
//   const addToCart = () => {

//     if (!token) {
//       toast.warning("Please login first");
//       navigate("/login");
//       return;
//     }

//     if (role !== "USER") {
//       toast.error("Only users can add to cart");
//       return;
//     }

//     axios.post("/cart/add", {
//       productId: product.productId,
//       quantity: 1
//     })
//     .then(() => {
//       toast.success("Product added to cart");
//     })
//     .catch(err => {
//       toast.error(err.response?.data?.message || "Failed to add to cart");
//     });
//   };

// ================= ADD TO CART =================


const addToCart = () => {

  if (!token) {
    setShowLoginModal(true);   // 🔥 popup instead of redirect
    return;
  }

  if (role !== "USER") {
    toast.error("Only users can add to cart");
    return;
  }

  axios.post("/cart/add", {
    productId: product.productId,
    quantity: 1
  })
  .then(() => {
    toast.success("Product added to cart");
    window.dispatchEvent(new Event('cartUpdated')); // notify navbar
    navigate("/cart");
  })
  .catch(() => {
    toast.error("Failed to add to cart");
  });
};


  
  return (
    <div className="container mt-4">

      <h3>{product.name}</h3>

      {/* IMAGES */}
          <div className="d-flex gap-3 flex-wrap mb-3">
      {product.images.map((url, index) => (
        <img
          key={index}
          src={url}
          width="130"
          className="border rounded"
          alt="product"
        />
      ))}

      </div>

      <p>{product.description}</p>

      <h5 className="text-success">₹ {product.price}</h5>

      {/* ADD TO CART BUTTON */}
      {role !== "ADMIN" && (
        <button
          className="btn btn-warning mt-3"
          onClick={addToCart}
        >
          Add to Cart
        </button>
      )}

          {/* 🔥 ADD MODAL HERE */}
     <LoginModal
      show={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />

      <hr />

      {/* PRODUCT COMMENTS */}
      <ProductComments productId={id} />
    </div>
  );
}

export default ProductDetails;
