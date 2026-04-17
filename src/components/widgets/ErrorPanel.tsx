import { motion } from "framer-motion";
import { AlertTriangle, XCircle, Info } from "lucide-react";

const alerts = [
  { severity: "critical", icon: XCircle, message: "Agent 'DataSync-03' exceeded memory limit", time: "3m ago" },
  { severity: "warning", icon: AlertTriangle, message: "API rate limit approaching (85%)", time: "15m ago" },
  { severity: "info", icon: Info, message: "Scheduled maintenance: GPU cluster B at 02:00 UTC", time: "1h ago" },
];

const severityStyles: Record<string, string> = {
  critical: "border-destructive/30 bg-destructive/5",
  warning: "border-warning/30 bg-warning/5",
  info: "border-primary/30 bg-primary/5",
};

const severityIcon: Record<string, string> = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
};

const ErrorPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="font-heading font-semibold text-lg">Alerts</h3>
        <span className="ml-auto text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">1 critical</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${severityStyles[alert.severity]}`}>
            <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${severityIcon[alert.severity]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ErrorPanel;
