import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });

      setSent(true);

      // show message briefly, then move to reset page
      setTimeout(() => {
        navigate("/verify-forgot-otp", { state: { email } });

      }, 800);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Forgot Password</h3>
    <div className="text-center text-muted mb-3">Enter your registered email to Reset Password</div>
      <input
        className="form-control mb-2"
        placeholder="Enter registered email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      {/* ✅ status message below input */}
      {sent && (
        <small className="text-success d-block mb-2">
          OTP has been sent to your email
        </small>
      )}

      <button className="btn btn-primary w-100" onClick={sendOtp}>
        Send OTP
      </button>
    </div>
  );
}
