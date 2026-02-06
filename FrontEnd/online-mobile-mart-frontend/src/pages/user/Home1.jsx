// original home page ui for guest user

import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import SearchAndFilter from "../../components/SearchAndFilter";
import HomeBanner from "./HomeBanner.jsx"

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Save favorites to localStorage whenever it changes
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const loadProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSearch = (searchTerm) => {
    let baseProducts = activeTab === "favorites"
      ? products.filter(product => favorites.includes(product.productId))
      : products;

    if (!searchTerm.trim()) {
      setFilteredProducts(baseProducts);
      return;
    }

    const filtered = baseProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (filters) => {
    let baseProducts = activeTab === "favorites"
      ? products.filter(product => favorites.includes(product.productId))
      : products;

    let filtered = [...baseProducts];

    if (filters.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= filters.minPrice);
    }

    if (filters.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice);
    }

    setFilteredProducts(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let baseProducts = tab === "favorites"
      ? products.filter(product => favorites.includes(product.productId))
      : products;
    setFilteredProducts(baseProducts);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <HomeBanner />
    <div className="container my-5">
      
      <center><h3>Products</h3></center>

      <ul className="d-flex justify-content-between nav">
        <div>
          <li className="nav-item"></li>
        </div>

        <div className="d-flex">
          {/* show all */}
          <li className="nav-item">
            <button
              className={`nav-link text-black fw-semibold ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'all' ? '2px solid #007bff' : 'none',
                paddingBottom: '8px'
              }}
            >
              All
            </button>
          </li>

          {/* only favs */}
          <li className="nav-item">
            <button
              className={`nav-link text-black fw-semibold ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => handleTabChange('favorites')}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'favorites' ? '2px solid #007bff' : 'none',
                paddingBottom: '8px'
              }}
            >
              Favorites ({favorites.length})
            </button>
          </li>
        </div>
      </ul>

      <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />

      {/* products to display */}
      <div className="row">
        {filteredProducts.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">
              {activeTab === 'favorites'
                ? "No favorite products yet. Click the heart icon to add favorites!"
                : "No products found matching your criteria."
              }
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.productId}>
              <ProductCard
                product={product}
                isFavorite={favorites.includes(product.productId)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}
