import LoginPage from "./pages/LoginPage";
import '../css/app.css'
require("./bootstrap");
import { Routes, Route, BrowserRouter, HashRouter } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { AuthProvider } from "./hooks/useAuth";
import ReactDOM from "react-dom";
import React from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/themes/tailwind-light/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./assets/layout/layout.scss";
import EmptyPage from "./pages/EmptyPage";
import HomeLayout from "./components/HomeLayout";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout";
import NoMatch from "./pages/NoMatch";
import UserManagement from "./pages/UserManagement/UserManagement";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import ShowAuction from "./pages/User/ShowAuction";
import AuctionManagement from "./pages/AuctionManagement/AuctionManagement";
import SessionManagement from "./pages/SessionManagement/SessionManagement";
import ShowAuctionDetail from "./pages/User/ShowAuctionDetail";
import ShowProduct from "./pages/User/ShowProduct";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="" element={<EmptyPage title="Trang chủ" />} />
        <Route path="login" element={<LoginPage title="Đăng nhập" />} />
        <Route path="register" element={<RegisterPage title="Đăng ký" />} />
      </Route>

      <Route path="/user" element={<Layout />}>
        <Route path="auction" element={<ShowAuction title="Đấu giá" />} />
      </Route>

      <Route path="/user/auction" element={<Layout />}>
        <Route path=":id" element={<ShowAuctionDetail title="Đấu giá" />}>
          <Route path="product/:pid" element={<ShowProduct />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<EmptyPage title="Tổng quan" />} />
        <Route
          path="users"
          element={<UserManagement title="Quản lý người dùng" />}
        />
        <Route
          path="settings"
          element={<EmptyPage title="Cấu hình hệ thống" />}
        />
        <Route
          path="products"
          element={<ProductManagement title="Quản lý sản phẩm" />}
        />
        <Route
          path="auctions"
          element={<AuctionManagement title="Quản lý đấu giá" />}
        />
        <Route
          path="sessions"
          element={<SessionManagement title="Quản lý Sessions" />}
        />
      </Route>
    </Routes>
  );
};

if (document.getElementById("root")) {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename="/app">
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
