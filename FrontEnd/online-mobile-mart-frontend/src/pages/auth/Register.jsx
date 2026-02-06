import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../cssStyles/auth.css"

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 🔐 password rules 
  const [showRules, setShowRules] = useState(false);
  const rules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[@$!%*?&]/.test(form.password),
  };

  const strength = Object.values(rules).filter(Boolean).length * 20;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const register = async () => {
    if (!form.name || !form.email || !form.password || !form.mobile) {
      toast.error("All fields are required");
      return;
    }

    if (strength < 100) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axiosInstance.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile
      });

      toast.success("OTP sent to email and mobile");
      navigate("/verify-otp", {
        state: {
          email: form.email,
          mobile: form.mobile
        }
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Register</h3>

      <input
        className="form-control mb-2"
        placeholder="Name"
        name="name"
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />

      {/* PASSWORD INPUT + EYE */}
      <div className="input-group mb-2">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          onFocus={() => setShowRules(true)}
        />
        <span
          className="input-group-text"
          style={{ cursor: "pointer" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* STRENGTH BAR 
      <div className="progress mb-2 password-strength">
        <div
          className={`progress-bar ${strength < 60 ? "bg-danger" :
              strength < 80 ? "bg-warning" : "bg-success"
            }`}
          style={{ width: `${strength}%` }}
        />
      </div> */}

      {/* PASSWORD RULES (visible checklist) */}
      {showRules && (
        <>
          {/* STRENGTH BAR */}
          <div className="progress mb-2 password-strength">
            <div
              className={`progress-bar ${strength < 60 ? "bg-danger" :
                  strength < 80 ? "bg-warning" : "bg-success"
                }`}
              style={{ width: `${strength}%` }}
            />
          </div>

          {/* PASSWORD RULES */}
          <ul className="small text-muted mb-3">
            <li className={rules.length ? "text-success" : ""}>
              8 characters
            </li>
            <li className={rules.upper ? "text-success" : ""}>
              Uppercase letter
            </li>
            <li className={rules.lower ? "text-success" : ""}>
              Lowercase letter
            </li>
            <li className={rules.number ? "text-success" : ""}>
              Number
            </li>
            <li className={rules.special ? "text-success" : ""}>
              Special character
            </li>
          </ul>
        </>
      )}

      {/* CONFIRM PASSWORD */}
      <div className="input-group mb-2">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={handleChange}
        />
        <span
          className="input-group-text"
          style={{ cursor: "pointer" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Mobile"
        name="mobile"
        onChange={handleChange}
      />

      {error && <small className="text-danger d-block mb-2">{error}</small>}

      <button
        className="btn btn-success w-100"
        onClick={register}
        disabled={strength < 100}
      >
        Register
      </button>

      {/* <p className="text-center mt-2">
        Already have an account? <a href="/login">Login</a>
      </p> */}

      {/* login */}
      <div className="text-center mt-3">
        <span className="text-muted">Already have an account? </span>
        <Link to="login" className="text-decoration-none fw-bold" style={{ color: '#007bff' }}>
          Login Here!
        </Link>
      </div>
      
    </div>
  );
}