import { useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

const greetings = [
  "Mirëmëngjes!",
  "Përshëndetje!",
  "Mirësevjen përsëri!",
];

export function TopBar() {
  const { user } = useAuth();
  const [greetingIndex] = useState(() => Math.floor(Math.random() * greetings.length));
  const greeting = greetings[greetingIndex];
  const today = useMemo(() => format(new Date(), "EEEE, d MMMM"), []);

  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <p className="topbar__greeting">{greeting}</p>
        <h1 className="topbar__headline">{user?.full_name ?? "Platforma E-Learning"}</h1>
        <p className="topbar__date">{today}</p>
      </div>
      <div className="topbar__actions">
        <button type="button" className="ghost-button">
          <span className="material-symbols-rounded">help</span>
          Ndihmë
        </button>
        <button type="button" className="primary-button">
          <span className="material-symbols-rounded">add</span>
          Krijo kurs
        </button>
      </div>
    </motion.header>
  );
}
