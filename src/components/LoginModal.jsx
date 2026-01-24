import { useNavigate } from "react-router-dom";

function LoginModal({ show, onClose }) {

  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Login Required</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p>Please login to add items to cart.</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginModal;
