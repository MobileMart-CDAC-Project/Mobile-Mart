import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {products.map(p => (
          <div className="col-md-3 mb-3" key={p.productId}>
            <div className="card h-100">
              <img src={p.images[0]?.imageUrl}
                   className="card-img-top" />
              <div className="card-body">
                <h5>{p.name}</h5>
                <p>₹ {p.price}</p>
                <Link to={`/product/${p.productId}`}
                      className="btn btn-primary btn-sm">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
