import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon: string;
  accent?: "blue" | "purple" | "green" | "orange";
}

export function StatCard({ title, value, trend, icon, accent = "blue" }: StatCardProps) {
  return (
    <motion.div
      className={`stat-card stat-card--${accent}`}
      whileHover={{ translateY: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="stat-card__icon">
        <span className="material-symbols-rounded">{icon}</span>
      </div>
      <div className="stat-card__body">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value">{value}</p>
        {trend && (
          <p className={`stat-card__trend ${trend.isPositive ? "is-positive" : "is-negative"}`}>
            <span className="material-symbols-rounded">
              {trend.isPositive ? "trending_up" : "trending_down"}
            </span>
            {trend.value}
          </p>
        )}
      </div>
    </motion.div>
  );
}
