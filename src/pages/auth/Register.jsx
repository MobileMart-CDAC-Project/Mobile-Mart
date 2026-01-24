import { useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post("/auth/register", form);
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3>Register</h3>
      <input className="form-control mb-2" placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="form-control mb-2" placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="form-control mb-2" type="password" placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <input className="form-control mb-2" placeholder="Mobile"
        onChange={e => setForm({ ...form, mobile: e.target.value })} />
      <button className="btn btn-success w-100" onClick={register}>
        Register
      </button>
    </div>
  );
}
