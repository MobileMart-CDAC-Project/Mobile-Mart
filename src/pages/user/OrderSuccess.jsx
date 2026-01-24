import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="container mt-5 text-center">
      <h2 className="text-success">🎉 Order Placed Successfully!</h2>

      <p className="mt-3">
        Thank you for shopping with us.
      </p>

      <div className="mt-4">
        <Link to="/orders" className="btn btn-primary me-2">
          View My Orders
        </Link>

        <Link to="/" className="btn btn-outline-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
