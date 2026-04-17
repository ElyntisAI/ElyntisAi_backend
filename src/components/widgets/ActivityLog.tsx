import { motion } from "framer-motion";
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock, ShieldCheck, PlayCircle } from "lucide-react";
import { useState } from "react";
import AgentTimeMachine from "./AgentTimeMachine";

const activities = [
  { icon: CheckCircle, text: "Email Classifier deployed successfully", time: "2m ago", status: "success" },
  { icon: ShieldCheck, text: "Slack API timeout -> Self-Correction successful", time: "5m ago", status: "healed" },
  { icon: Activity, text: "Swarm 'CodeReview' processing 4 modules", time: "8m ago", status: "active" },
  { icon: AlertTriangle, text: "SalesBot: HITL Approval Required", time: "12m ago", status: "warning" },
  { icon: CheckCircle, text: "Neural Executor optimized NIM scaling", time: "18m ago", status: "success" },
  { icon: ShieldCheck, text: "DB Deadlock resolved via retry protocol", time: "25m ago", status: "healed" },
];

const statusColors: Record<string, string> = {
  success: "text-success",
  active: "text-accent",
  healed: "text-primary shadow-[0_0_8px_hsla(258,100%,69%,0.4)]",
  warning: "text-warning",
  error: "text-destructive",
};

const ActivityLog = () => {
  const [isTimeMachineOpen, setIsTimeMachineOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6 h-full"
      >
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-lg">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
            <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusColors[item.status]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{item.text}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.time}
                </p>
                {(item.status === 'success' || item.status === 'healed') && (
                  <button 
                    onClick={() => setIsTimeMachineOpen(true)}
                    className="text-[10px] text-accent hover:text-white flex items-center gap-1 transition-colors font-bold uppercase tracking-wider"
                  >
                    <PlayCircle className="w-3 h-3" /> Replay
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </motion.div>

      <AgentTimeMachine 
        isOpen={isTimeMachineOpen} 
        onClose={() => setIsTimeMachineOpen(false)} 
      />
    </>
  );
};

export default ActivityLog;
