import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const isAdmin = user?.role === "administrator";
  const link = ({ isActive }) => `block px-4 py-2 rounded-lg ${isActive ? "bg-brand-600 text-white" : "hover:bg-slate-100"}`;
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 bg-white border-r border-slate-200 p-4 md:min-h-screen">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-brand-600 rounded-xl grid place-items-center text-white font-bold">SW</div>
          <div>
            <div className="font-bold text-slate-900">SwiftWheels</div>
            <div className="text-xs text-slate-500">Huye, Rwanda</div>
          </div>
        </Link>
        <nav className="space-y-1 text-sm">
          <NavLink to="/" end className={link}>Dashboard</NavLink>
          <NavLink to="/vehicles" className={link}>Vehicles</NavLink>
          {isAdmin && <NavLink to="/customers" className={link}>Customers</NavLink>}
          {isAdmin && <NavLink to="/reservations" className={link}>Reservations</NavLink>}
          {!isAdmin && <><NavLink to="/request-reservation" className={link}>Request Reservation</NavLink><NavLink to="/my-reservations" className={link}>My Reservations</NavLink></>}
          {isAdmin && <NavLink to="/report" className={link}>Report</NavLink>}
        </nav>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">Logged in as</div>
          <div className="font-medium">{user?.username}</div>
          <div className="text-xs capitalize text-brand-600">{user?.role}</div>
          <button className="btn-ghost mt-3 w-full justify-center" onClick={() => { logout(); nav("/login"); }}>Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8"><Outlet /></main>
    </div>
  );
}
