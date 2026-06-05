import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import Reservations from "./pages/Reservations";
import Report from "./pages/Report";
import MyReservations from "./pages/MyReservations";
import CustomerReservation from "./pages/CustomerReservation";

const Protected = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Protected roles={["administrator"]}><Customers /></Protected>} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/reservations" element={<Protected roles={["administrator"]}><Reservations /></Protected>} />
        <Route path="/request-reservation" element={<Protected roles={["customer"]}><CustomerReservation /></Protected>} />
        <Route path="/my-reservations" element={<Protected roles={["customer"]}><MyReservations /></Protected>} />
        <Route path="/report" element={<Protected roles={["administrator"]}><Report /></Protected>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
