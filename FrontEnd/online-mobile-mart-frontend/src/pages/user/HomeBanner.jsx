import "../../cssStyles/homeBanner.css";

const HomeBanner = () => {
  return (
    <>
      <div
        id="homeBanner"
        className="carousel slide banner-container"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        data-bs-pause="hover"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#homeBanner" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#homeBanner" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#homeBanner" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#homeBanner" data-bs-slide-to="3"></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">

          {/* Slide 1 – Sale */}
          <div className="carousel-item active">
            <img src="/images/banner/sale1.png" className="d-block w-100 banner-img" alt="Big Sale" />
            <div className="banner-overlay">
              <h2 className="banner-title">Big Sale 🔥</h2>
              <p className="banner-subtitle">Up to 40% off on Smartphones</p>
              <button className="btn btn-warning banner-btn">Shop Now</button>
            </div>
          </div>

          {/* Slide 2 – Upcoming */}
          <div className="carousel-item">
            <img src="/images/banner/upcoming1.png" className="d-block w-100 banner-img" alt="Upcoming Mobiles" />
            <div className="banner-overlay">
              <h2 className="banner-title">Launching Soon 🚀</h2>
              <p className="banner-subtitle">Next-Gen 5G Mobiles</p>
              <button className="btn btn-light banner-btn">Explore</button>
            </div>
          </div>

          {/* Slide 3 – New Arrivals */}
          <div className="carousel-item">
            <img src="/images/banner/newarrival.jpg" className="d-block w-100 banner-img" alt="New Arrivals" />
            <div className="banner-overlay">
              <h2 className="banner-title">New Arrivals 📱</h2>
              <p className="banner-subtitle">Latest Models Available</p>
              <button className="btn btn-outline-light banner-btn">View Collection</button>
            </div>
          </div>

          {/* Slide 4 – Republic Day */}
          <div className="carousel-item republic-slide">
            <img src="/images/banner/republic-day-sale.png" className="d-block w-100 banner-img" alt="Republic Day Sale" />
            <div className="banner-overlay">
              <h2 className="banner-title">🇮🇳 Republic Day Sale</h2>
              <p className="banner-subtitle">Flat 35% Off on Smartphones</p>
              <button className="btn btn-success banner-btn">Celebrate Savings</button>
            </div>
          </div>

        </div>

        {/* Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#homeBanner" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#homeBanner" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </>
  );
};

export default HomeBanner;
