import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    try {
      const res = await axios.post("/auth/login", {
        email,
        password
      });

      // BACKEND RESPONSE (as per your API)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      toast.success("Login successful");

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

      <button className="btn btn-primary w-100" onClick={login}>
        Login
      </button>
      <p className="text-center mt-2">
        Don't have an account? <a href="/register">Register here!</a>
      </p>
   </div>
   
  );
}

