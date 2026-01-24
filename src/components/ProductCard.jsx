import { Link } from "react-router-dom";

function ProductCard({ product }) {

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : "https://via.placeholder.com/200";

  return (
    <div className="card h-100 shadow-sm">

      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "contain" }}
      />

      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.name}</h6>

        <p className="fw-bold text-success mb-2">
          ₹ {product.price}
        </p>

        <Link
          to={`/product/${product.productId}`}
          className="btn btn-primary btn-sm mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
