import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/products")
      .then(res => {
        setProducts(res.data);
      })
      .catch(() => {
        toast.error("Failed to load products");
      });
  }, []);

  return (
    <div className="container mt-4">

      <h4 className="mb-3">Mobiles</h4>

      <div className="row">
        {products.map(product => (
          <div
            className="col-lg-3 col-md-4 col-sm-6 mb-4"
            key={product.productId}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;
