import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./components/login/useAuth";

import Login from "./components/login/Login";


import AdminDashboard from "./components/admin/AdminDashboard";
import UserLayout from "./components/layout/UserLayout";

// --- Component bảo vệ Route ---
const AdminRoute = ({ children }) => {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  // Sử dụng parseInt để ép kiểu về số trước khi so sánh
  if (!user || parseInt(user.role) !== 1) {
    alert("Bạn không có quyền Admin!");
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const {
    currentUser,
    handleLogin,
    handleRegister,
    handleLogout
  } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* ===== ADMIN - ĐÃ ĐƯỢC BẢO VỆ ===== */}
        <Route
          path="adm"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ===== USER ===== */}
        <Route
          element={
            <UserLayout
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          }
        >

          <Route path="/" element={<Login onLogin={handleLogin} />} />

        </Route>

      </Routes >
    </BrowserRouter >
  );
}

export default App;