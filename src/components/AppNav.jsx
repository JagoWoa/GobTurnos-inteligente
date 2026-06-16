import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export function AppNav({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
      {icon}
      <span>{label}</span>
      <ChevronRight aria-hidden="true" />
    </NavLink>
  );
}
