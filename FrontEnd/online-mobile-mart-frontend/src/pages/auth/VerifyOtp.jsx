import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, mobile } = location.state || {};

  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes

  // If user opens page directly
  useEffect(() => {
    if (!email || !mobile) {
      navigate("/register");
    }
  }, [email, mobile, navigate]);

  // OTP countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtp = async () => {
    if (!emailOtp || !mobileOtp) {
      toast.error("Both OTPs are required");
      return;
    }

    try {
      await axios.post("/auth/verify-otp", {
        email,
        emailOtp,
        mobileOtp
      });

      toast.success("Verification successful");
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
    
    // 🔴 TEMP MOCK — remove later
    // toast.success("Registration completed successfully");
    // navigate("/login");
    
  };

  const resendOtp = async () => {
    try {
      await axios.post("/auth/resend-otp", { email });
      toast.success("OTP resent");
      setTimer(300);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Verify OTP</h3>

      <p className="text-center text-muted">
        OTP sent to <br />
         Email {email} <br />
         Mobile {mobile}
      </p>

      <input
        className="form-control mb-2"
        placeholder="Email OTP"
        value={emailOtp}
        onChange={e => setEmailOtp(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Mobile OTP"
        value={mobileOtp}
        onChange={e => setMobileOtp(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={verifyOtp}
      >
        Verify OTP
      </button>

      <div className="text-center mt-3">
        {timer > 0 ? (
          <small className="text-muted">
            Resend OTP in {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </small>
        ) : (
          <button
            className="btn btn-link"
            onClick={resendOtp}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
