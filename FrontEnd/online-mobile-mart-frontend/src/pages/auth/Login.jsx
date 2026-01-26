import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password
      });

      // BACKEND RESPONSE (as per your API)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      toast.success("Login successful");

      // Trigger navbar update
      window.dispatchEvent(new Event("authChanged"));

      // redirect based on role
      if (res.data.role === "ADMIN") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (

    <div className="container mt-5 col-md-4">
      <h3 className="text-center mb-3">Login</h3>

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {/* forgot password link */}
      <div className="d-flex justify-content-end mb-4">
        <Link to="/forgot-password"
          className="text-decoration-none fw-bold "
          style={{ color: '#007bff' }} >
          Forgot password?
        </Link>
      </div>

      {/* <button className="btn btn-primary w-100" onClick={login}>
        Login
      </button> */}
      <button
        className="btn btn-primary w-100"
        onClick={login}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>


      <div className="text-center mt-3">
        <span className="text-muted">Don't have an account? </span>
        <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#007bff' }}>
          Create one
        </Link>
      </div>
    </div>

  );
}

