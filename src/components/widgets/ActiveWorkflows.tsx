import { motion } from "framer-motion";
import { GitBranch, Play, Pause, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const workflows = [
  { name: "Lead Scoring Pipeline", status: "running", runs: 1243, icon: Play },
  { name: "Email Auto-Response", status: "running", runs: 892, icon: Play },
  { name: "Data Enrichment Flow", status: "paused", runs: 456, icon: Pause },
  { name: "Customer Onboarding", status: "running", runs: 2341, icon: Play },
];

const ActiveWorkflows = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <GitBranch className="w-5 h-5 text-accent" />
        <h3 className="font-heading font-semibold text-lg">Active Workflows</h3>
      </div>

      <div className="space-y-3">
        {workflows.map((wf, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/30 hover:border-primary/20 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${wf.status === "running" ? "bg-success/10" : "bg-warning/10"}`}>
              <wf.icon className={`w-4 h-4 ${wf.status === "running" ? "text-success" : "text-warning"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{wf.name}</p>
              <p className="text-xs text-muted-foreground">{wf.runs.toLocaleString()} runs</p>
            </div>
            <Badge variant="outline" className={`text-xs ${wf.status === "running" ? "border-success/30 text-success" : "border-warning/30 text-warning"}`}>
              <Circle className={`w-1.5 h-1.5 mr-1 fill-current ${wf.status === "running" ? "animate-pulse" : ""}`} />
              {wf.status}
            </Badge>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActiveWorkflows;
