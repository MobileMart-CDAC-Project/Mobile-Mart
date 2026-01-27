import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// public pages
import Home from "./pages/user/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProductDetails from "./pages/user/ProductDetails";
import Unauthorized from "./pages/Unauthorized";

// protected pages
import MyOrders from "./pages/user/MyOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfile from "./pages/user/UserProfile";

// route guard
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./pages/user/Cart"
import Checkout from "./pages/user/Checkout"
import OrderSuccess from "./pages/user/OrderSuccess";
import OrderDetails from "./pages/user/OrderDetails";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import VerifyOtp from "./pages/auth/VerifyOtp";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />


        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ================= USER PROTECTED ================= */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="USER">
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="USER">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN PROTECTED ================= */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

          
          <Route
             path="/order-success"
             element={
             <ProtectedRoute role="USER">
                <OrderSuccess />
            </ProtectedRoute>
           }
          />

        <Route path="/cart" element={
           <ProtectedRoute role="USER">
           <Cart />
           </ProtectedRoute>
        } />
        <Route path="/checkout" element={
           <ProtectedRoute role="USER">
           <Checkout />
           </ProtectedRoute>
        } />
        <Route
          path="/orders"
          element={
          <ProtectedRoute role="USER">
           <MyOrders />
         </ProtectedRoute>
         }
        />

        <Route
           path="/orders/:id"
           element={
         <ProtectedRoute role="USER">
          <OrderDetails />
        </ProtectedRoute>
        }
        />
        <Route
          path="/admin/orders"
          element={
         <ProtectedRoute role="ADMIN">
          <AdminOrders />
        </ProtectedRoute>
        }
        />
        <Route
         path="/admin/orders/:id"
        element={
         <ProtectedRoute role="ADMIN">
           <AdminOrderDetails />
       </ProtectedRoute>
         }
      />

<Route
  path="/admin/orders/:id"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminOrderDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/products/add"
  element={
    <ProtectedRoute role="ADMIN">
      <AddProduct />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/products/edit/:id"
  element={
    <ProtectedRoute role="ADMIN">
      <EditProduct />
    </ProtectedRoute>
  }
/>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
