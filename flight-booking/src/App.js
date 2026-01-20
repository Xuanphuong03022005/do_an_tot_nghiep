import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuth from "./components/login/useAuth";

import Login from "./components/login/Login";
import Register from "./components/login/Register";
import Home from "./components/home/Home";
import FlightInfo from "./components/flightInfo/FlightInfo";
import Ticket from "./components/ticket/Ticket";
import Form from './components/form/Form';
import PaymentReview from "./components/allservice/PaymentReview";

import AdminDashboard from "./components/admin/AdminDashboard";
import UserLayout from "./components/layout/UserLayout";

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

        {/* ===== ADMIN ===== */}
        <Route path="/" element={<AdminDashboard />} />

        {/* ===== USER ===== */}
        <Route
          element={
            <UserLayout
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/flight-info" element={<FlightInfo />} />
          <Route path="/my-ticket" element={<Ticket />} />
          <Route path="/info" element={<Form />} />
          <Route path="/review" element={<PaymentReview />} />
        </Route>

      </Routes >
    </BrowserRouter >
  );
}

export default App;
