import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Përmbledhje", icon: "space_dashboard" },
  { to: "/courses", label: "Kurse", icon: "menu_book" },
  { to: "/assignments", label: "Detyra", icon: "task" },
  { to: "/quizzes", label: "Quiz", icon: "quiz" },
  { to: "/analytics", label: "Analitika", icon: "monitoring" },
  { to: "/discussions", label: "Diskutime", icon: "forum" },
  { to: "/messages", label: "Mesazhe", icon: "mail" },
  { to: "/notifications", label: "Njoftime", icon: "notifications" },
  { to: "/certificates", label: "Certifikata", icon: "verified" },
];

export function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="sidebar">
      <motion.div
        className="sidebar__brand"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="sidebar__logo">E</div>
        <div>
          <p className="sidebar__title">E-Learning Suite</p>
          <p className="sidebar__subtitle">Një eksperiencë digjitale premium</p>
        </div>
      </motion.div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="material-symbols-rounded">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{user?.full_name?.charAt(0) ?? "U"}</div>
          <div>
            <p className="sidebar__user-name">{user?.full_name ?? "Përdorues"}</p>
            <p className="sidebar__user-role">{user?.role ?? "student"}</p>
          </div>
        </div>
        <button className="sidebar__logout" type="button" onClick={logout}>
          <span className="material-symbols-rounded">logout</span>
          Dalje
        </button>
      </div>
    </aside>
  );
}
