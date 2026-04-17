import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Play, Pause, Circle, Plus, ArrowRight, X, Loader2, Clock, Hash, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialWorkflows = [
  { id: 1, name: "Lead Scoring Pipeline", status: "running", nodes: 5, runs: 1243, lastRun: "2m ago" },
  { id: 2, name: "Email Auto-Response", status: "running", nodes: 4, runs: 892, lastRun: "5m ago" },
  { id: 3, name: "Data Enrichment Flow", status: "paused", nodes: 7, runs: 456, lastRun: "1h ago" },
  { id: 4, name: "Customer Onboarding", status: "running", nodes: 6, runs: 2341, lastRun: "30s ago" },
  { id: 5, name: "Invoice Processing", status: "paused", nodes: 3, runs: 128, lastRun: "3h ago" },
  { id: 6, name: "Support Ticket Router", status: "running", nodes: 4, runs: 3892, lastRun: "10s ago" },
];

const Workflows = () => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [selected, setSelected] = useState<typeof initialWorkflows[0] | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleToggleStatus = (id: number) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== id) return wf;
        const next = wf.status === "running" ? "paused" : "running";
        toast.success(`"${wf.name}" ${next === "running" ? "▶ resumed" : "⏸ paused"}`);
        // sync selected panel
        if (selected?.id === id) setSelected({ ...selected, status: next });
        return { ...wf, status: next, lastRun: "just now" };
      })
    );
  };

  const handleRowClick = (wf: typeof initialWorkflows[0]) => {
    setSelected(wf);
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error("Please enter a workflow name"); return; }
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1200));
    const newWf = { id: Date.now(), name: newName, status: "paused", nodes: 1, runs: 0, lastRun: "Never" };
    setWorkflows((prev) => [newWf, ...prev]);
    toast.success(`Workflow "${newName}" created!`);
    setNewName("");
    setIsCreating(false);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gradient-purple">Workflows</h1>
          <p className="text-muted-foreground mt-1">Design and monitor automated AI pipelines</p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="bg-primary hover:bg-primary/90 glow-purple gap-2">
          <Plus className="w-4 h-4" /> New Workflow
        </Button>
      </div>

      <div className="space-y-3">
        {workflows.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleRowClick(wf)}
            className="glass rounded-xl p-5 flex items-center gap-4 hover:glow-border-purple transition-all cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wf.status === "running" ? "bg-success/10" : "bg-warning/10"}`}>
              <GitBranch className={`w-5 h-5 ${wf.status === "running" ? "text-success" : "text-warning"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold">{wf.name}</h3>
              <p className="text-sm text-muted-foreground">{wf.nodes} nodes · {wf.runs.toLocaleString()} runs · Last: {wf.lastRun}</p>
            </div>
            <Badge variant="outline" className={wf.status === "running" ? "border-success/30 text-success" : "border-warning/30 text-warning"}>
              <Circle className={`w-1.5 h-1.5 mr-1 fill-current ${wf.status === "running" ? "animate-pulse" : ""}`} />
              {wf.status}
            </Badge>
            {/* Clickable arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handleToggleStatus(wf.id); }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border
                ${wf.status === "running"
                  ? "border-warning/30 bg-warning/10 hover:bg-warning/20 text-warning"
                  : "border-success/30 bg-success/10 hover:bg-success/20 text-success"
                }`}
              title={wf.status === "running" ? "Pause workflow" : "Resume workflow"}
            >
              {wf.status === "running" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </motion.div>
        ))}
      </div>

      {/* Workflow Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              className="glass-strong rounded-2xl p-8 w-full max-w-md mx-4 glow-border-purple space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected.status === "running" ? "bg-success/10" : "bg-warning/10"}`}>
                    <GitBranch className={`w-5 h-5 ${selected.status === "running" ? "text-success" : "text-warning"}`} />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-lg">{selected.name}</h2>
                    <Badge variant="outline" className={selected.status === "running" ? "border-success/30 text-success text-xs" : "border-warning/30 text-warning text-xs"}>
                      <Circle className={`w-1.5 h-1.5 mr-1 fill-current ${selected.status === "running" ? "animate-pulse" : ""}`} />
                      {selected.status}
                    </Badge>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Hash, label: "Nodes", value: selected.nodes },
                  { icon: Zap, label: "Total Runs", value: selected.runs.toLocaleString() },
                  { icon: Clock, label: "Last Run", value: selected.lastRun },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-3 text-center">
                    <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold text-sm">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleToggleStatus(selected.id)}
                  className={`flex-1 gap-2 ${selected.status === "running" ? "border-warning/30 text-warning hover:bg-warning/10" : "border-success/30 text-success hover:bg-success/10"}`}
                >
                  {selected.status === "running" ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
                </Button>
                <Button onClick={() => setSelected(null)} className="flex-1 bg-primary hover:bg-primary/90 glow-purple">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Workflow Modal */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowNewModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-strong rounded-2xl p-8 w-full max-w-sm mx-4 glow-border-purple space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-lg">New Workflow</h2>
                <button onClick={() => setShowNewModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Workflow Name</label>
                <Input
                  placeholder="e.g. Customer Onboarding Flow"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="bg-secondary/50 border-border/50 h-11"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowNewModal(false)} className="flex-1 border-border/50">Cancel</Button>
                <Button onClick={handleCreate} disabled={isCreating} className="flex-1 bg-primary hover:bg-primary/90 glow-purple gap-2">
                  {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create</>}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workflows;

