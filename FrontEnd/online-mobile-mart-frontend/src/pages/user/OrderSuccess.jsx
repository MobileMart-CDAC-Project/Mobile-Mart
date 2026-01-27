import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mt-5 text-center">
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h2 className="text-success mb-3">🎉 Order Placed Successfully!</h2>

          <div className="alert alert-success">
            <h5>Payment Completed</h5>
            <p className="mb-0">Your payment has been processed successfully.</p>
          </div>

          {orderId && (
            <p className="text-muted">Order ID: <strong>{orderId}</strong></p>
          )}

          <p className="mt-3">
            Thank you for shopping with Mobile Mart. You will receive an email confirmation shortly.
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
      </div>
    </div>
  );
}

export default OrderSuccess;
