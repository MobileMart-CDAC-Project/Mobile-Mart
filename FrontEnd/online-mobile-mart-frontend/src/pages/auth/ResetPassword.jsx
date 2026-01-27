import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../cssStyles/auth.css";
export default function ResetPassword() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  const otp = state?.otp;

  // ✅ redirect SAFELY
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  if (!email || !otp) return null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const strength =
    Object.values(rules).filter(Boolean).length * 20;

  const submit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="container mt-5 col-md-4">

      <div className="alert alert-success text-center py-2">
        OTP verified successfully
      </div>

      <h3 className="text-center mb-3">Reset Password</h3>

      {/* PASSWORD INPUT + EYE */}
      <div className="input-group mb-2">
        <input
          type={showPwd ? "text" : "password"}
          className="form-control"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <span
          className="input-group-text"
          style={{ cursor: "pointer" }}
          onClick={() => setShowPwd(!showPwd)}
        >
          {showPwd ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* STRENGTH BAR */}
      <div className="progress mb-2 password-strength">
        <div
          className={`progress-bar ${
            strength < 60 ? "bg-danger" :
            strength < 80 ? "bg-warning" : "bg-success"
          }`}
          style={{ width: `${strength}%` }}
        />
      </div>

      {/* PASSWORD RULES */}
      <ul className="small text-muted mb-3">
        <li className={rules.length ? "text-success" : ""}>8 characters</li>
        <li className={rules.upper ? "text-success" : ""}>Uppercase letter</li>
        <li className={rules.lower ? "text-success" : ""}>Lowercase letter</li>
        <li className={rules.number ? "text-success" : ""}>Number</li>
        <li className={rules.special ? "text-success" : ""}>Special character</li>
      </ul>

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />

      {error && <small className="text-danger d-block mb-2">{error}</small>}

      <button
        className="btn btn-success w-100"
        disabled={strength < 100}
        onClick={submit}
      >
        Reset Password
      </button>
    </div>
  );
}
