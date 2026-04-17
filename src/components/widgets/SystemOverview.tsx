import { motion } from "framer-motion";
import { Bot, Cpu, Clock, Activity } from "lucide-react";

const stats = [
  { icon: Bot, label: "Active Agents", value: "24", change: "+3", color: "text-primary", glow: "glow-border-purple" },
  { icon: Cpu, label: "GPU Usage", value: "78%", change: "+5%", color: "text-accent", glow: "glow-border-cyan" },
  { icon: Clock, label: "Avg Latency", value: "12ms", change: "-2ms", color: "text-success", glow: "" },
  { icon: Activity, label: "Exec Load", value: "1.2K/s", change: "+8%", color: "text-warning", glow: "" },
];

const SystemOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`glass rounded-xl p-5 ${stat.glow} hover:scale-[1.02] transition-transform`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-xs text-success font-medium">{stat.change}</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default SystemOverview;
