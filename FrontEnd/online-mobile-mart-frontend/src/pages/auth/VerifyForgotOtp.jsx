import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../cssStyles/otp.css";

export default function VerifyForgotOtp() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const continueToReset = () => {
    if (otp.join("").length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    // no API call here
    navigate("/reset-password", {
      state: { email, otp: otp.join("") }
    });
  };

  return (
    <div className="container mt-5 col-md-4">
      <div className="alert alert-info text-center py-2">
        OTP sent to <strong>{email}</strong>
      </div>

      <h3 className="text-center mb-3">Verify OTP</h3>

      <div className="d-flex justify-content-between mb-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputsRef.current[i] = el}
            className="otp-box"
            maxLength="1"
            value={digit}
            onChange={e => handleOtpChange(e.target.value, i)}
          />
        ))}
      </div>

      {error && <small className="text-danger d-block mb-2">{error}</small>}

      <button className="btn btn-primary w-100" onClick={continueToReset}>
        Continue
      </button>
    </div>
  );
}
