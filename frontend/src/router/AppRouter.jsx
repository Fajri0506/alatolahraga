import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AlatList from "../pages/AlatList";
import DetailAlat from "../pages/DetailAlat";
import SewaAlat from "../pages/SewaAlat";
import RiwayatSewa from "../pages/RiwayatSewa";
import AdminDashboard from "../pages/AdminDashboard";
import AdminKategori from "../pages/AdminKategori";
import AdminAlat from "../pages/AdminAlat";
import AdminPenyewaan from "../pages/AdminPenyewaan";
import AdminPengembalian from "../pages/AdminPengembalian";
import AdminPembayaran from "../pages/AdminPembayaran";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/alat" element={<AlatList />} />
          <Route path="/alat/:id" element={<DetailAlat />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/sewa/:id" element={<SewaAlat />} />
            <Route path="/riwayat" element={<RiwayatSewa />} />
          </Route>
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="kategori" element={<AdminKategori />} />
          <Route path="alat" element={<AdminAlat />} />
          <Route path="penyewaan" element={<AdminPenyewaan />} />
          <Route path="pengembalian" element={<AdminPengembalian />} />
          <Route path="pembayaran" element={<AdminPembayaran />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;