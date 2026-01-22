import { useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    percent: 0,
    color: "bg-danger"
  });

  // 🔐 password strength
  const calculatePasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return { percent: 25, color: "bg-danger" };
    if (score <= 4) return { percent: 60, color: "bg-warning" };
    return { percent: 100, color: "bg-success" };
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(password)) {
      return "Password must be 8+ chars, include uppercase, number & special char";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
      setPasswordError(validatePassword(value));
    }
  };

  const register = async () => {
    if (!form.name || !form.email || !form.password || !form.mobile) {
      toast.error("All fields are required");
      return;
    }

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile
      });

      toast.success("Registration successful");
      navigate("/login");

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

      {/* PASSWORD */}
      <div className="mb-2">
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <span
            className="input-group-text"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </span>
        </div>

        <div className="progress mt-1" style={{ height: "6px" }}>
          <div
            className={`progress-bar ${passwordStrength.color}`}
            style={{ width: `${passwordStrength.percent}%` }}
          ></div>
        </div>

        <small className="text-danger">{passwordError}</small>
      </div>


      {/* CONFIRM PASSWORD */}
      <div className="mb-2">
        <div className="input-group">
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
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </span>
        </div>
      </div>
      
      <input
        className="form-control mb-3"
        placeholder="Mobile"
        name="mobile"
        onChange={handleChange}
      />

      <button
        className="btn btn-success w-100"
        onClick={register}
        disabled={passwordError !== ""}
      >
        Register
      </button>

      <p className="text-center mt-2">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
