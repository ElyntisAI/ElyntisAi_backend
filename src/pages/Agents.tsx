import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Play, Pause, AlertCircle, Clock, TrendingUp, Plus, Square, X, Loader2, Rocket, Sparkles, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const initialAgents = [
  { id: 1, name: "Email Classifier", status: "active", successRate: 98.5, lastRun: "2m ago", tasks: 1243 },
  { id: 2, name: "Lead Scorer", status: "active", successRate: 95.2, lastRun: "5m ago", tasks: 892 },
  { id: 3, name: "Data Enrichment", status: "idle", successRate: 99.1, lastRun: "1h ago", tasks: 456 },
  { id: 4, name: "Slack Notifier", status: "error", successRate: 87.3, lastRun: "12m ago", tasks: 2341 },
  { id: 5, name: "Report Generator", status: "active", successRate: 96.7, lastRun: "30s ago", tasks: 3102 },
  { id: 6, name: "GitHub Sync", status: "idle", successRate: 94.8, lastRun: "3h ago", tasks: 678 },
];

const statusConfig: Record<string, { color: string; icon: typeof Play; badge: string }> = {
  active: { color: "text-success", icon: Play, badge: "border-success/30 text-success" },
  idle: { color: "text-muted-foreground", icon: Pause, badge: "border-muted-foreground/30 text-muted-foreground" },
  error: { color: "text-destructive", icon: AlertCircle, badge: "border-destructive/30 text-destructive" },
};

const Agents = () => {
  const [agents, setAgents] = useState(initialAgents);
  const [activeTab, setActiveTab] = useState<"my-agents" | "templates">("my-agents");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentTask, setNewAgentTask] = useState("");
  const [newAgentIntegration, setNewAgentIntegration] = useState("");
  const [newAgentModel, setNewAgentModel] = useState("llama3-70b");
  const [newAgentCompute, setNewAgentCompute] = useState("h100-nim");
  const [enableCoT, setEnableCoT] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    { name: "Sales Outreach Bot", desc: "Autonomously researches leads and drafts personalized emails.", model: "Mistral-7B", cost: "0.02c/run" },
    { name: "Code Quality Auditor", desc: "Reviews PRs and suggests optimizations using NeMo Guardrails.", model: "Llama3-70B", cost: "0.15c/run" },
    { name: "Support Triage AI", desc: "Analyzes ticket sentiment and routes to the correct department.", model: "Llama3-8B", cost: "0.01c/run" },
  ];

  const handleUseTemplate = (temp: { name: string; desc: string; model: string; cost: string }) => {
    setNewAgentName(temp.name);
    setNewAgentTask(temp.desc);
    
    if (temp.model === "Mistral-7B") {
      setNewAgentModel("mistral-large");
    } else if (temp.model === "Llama3-70B" || temp.model === "Llama3-8B") {
      setNewAgentModel("llama3-70b");
    }
    
    setNewAgentIntegration("");
    setShowCreateModal(true);
  };

  const handleStatusChange = (id: number, action: "start" | "pause" | "stop") => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;

    const newStatus = action === "start" ? "active" : action === "pause" ? "idle" : "idle";
    setAgents((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus, lastRun: "just now" } : a));

    const messages: Record<string, string> = {
      start: `▶ "${agent.name}" is now running`,
      pause: `⏸ "${agent.name}" has been paused`,
      stop: `⏹ "${agent.name}" has been stopped`,
    };
    toast.success(messages[action]);
  };

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast.error("Please enter an agent name");
      return;
    }
    if (!newAgentTask.trim()) {
      toast.error("Please enter a task definition");
      return;
    }

    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1500));

    const newAgent = {
      id: Date.now(),
      name: newAgentName,
      status: "idle",
      successRate: 100,
      lastRun: "Never",
      tasks: 0,
    };
    setAgents((prev) => [newAgent, ...prev]);
    toast.success(`Agent "${newAgentName}" created!`, {
      description: newAgentIntegration ? `Linked to ${newAgentIntegration}` : "Ready to deploy",
    });

    setNewAgentName("");
    setNewAgentTask("");
    setNewAgentIntegration("");
    setIsCreating(false);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gradient-purple">AI Agent Hub</h1>
          <p className="text-muted-foreground mt-1">Deploy and monitor your autonomous workforce powered by NVIDIA NIM</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-secondary/50 rounded-lg p-1 border border-border/50">
            <button 
              onClick={() => setActiveTab("my-agents")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'my-agents' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              My Agents
            </button>
            <button 
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'templates' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Templates
            </button>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary/90 glow-purple gap-2 ml-auto">
            <Plus className="w-4 h-4" /> Create Agent
          </Button>
        </div>
      </div>

      {activeTab === "my-agents" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, i) => {
          const config = statusConfig[agent.status];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:glow-border-purple transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="outline" className={config.badge}>
                  <config.icon className="w-3 h-3 mr-1" />
                  {agent.status}
                </Badge>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-3">{agent.name}</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Success</span>
                  <span className={agent.successRate > 95 ? "text-success" : "text-warning"}>{agent.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Last Run</span>
                  <span>{agent.lastRun}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <span>{agent.tasks.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-border/20">
                {agent.status !== "active" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(agent.id, "start")}
                    className="flex-1 h-8 bg-success/10 hover:bg-success/20 text-success border border-success/20 gap-1"
                    variant="outline"
                  >
                    <Play className="w-3 h-3" /> Start
                  </Button>
                )}
                {agent.status === "active" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(agent.id, "pause")}
                    className="flex-1 h-8 bg-warning/10 hover:bg-warning/20 text-warning border border-warning/20 gap-1"
                    variant="outline"
                  >
                    <Pause className="w-3 h-3" /> Pause
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(agent.id, "stop")}
                  className="flex-1 h-8 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 gap-1"
                  variant="outline"
                >
                  <Square className="w-3 h-3" /> Stop
                </Button>
              </div>
            </motion.div>
          );
        })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((temp, i) => (
            <motion.div
              key={temp.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border-white/5 hover:glow-border-cyan transition-all group flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-accent" />
                </div>
                <Badge variant="outline" className="bg-success/10 border-success/20 text-success text-[10px] uppercase font-bold tracking-wider">Verified Template</Badge>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-accent transition-colors">{temp.name}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-6 leading-relaxed">{temp.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Est. Cost: <span className="text-foreground font-bold">{temp.cost}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleUseTemplate(temp)}
                  className="bg-accent hover:bg-accent/90 text-white gap-2"
                >
                  <Zap className="w-3 h-3 fill-current" /> Use Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Agent Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-strong rounded-2xl p-8 w-full max-w-md mx-4 glow-border-purple"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading font-bold">Create New Agent</h2>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Agent Name</label>
                  <Input
                    placeholder="e.g. Email Classifier Agent"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="bg-secondary/50 border-border/50 h-11"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Task Definition</label>
                  <Input
                    placeholder="Classify incoming emails and route to teams"
                    value={newAgentTask}
                    onChange={(e) => setNewAgentTask(e.target.value)}
                    className="bg-secondary/50 border-border/50 h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Agent Model</label>
                    <Select value={newAgentModel} onValueChange={setNewAgentModel}>
                      <SelectTrigger className="bg-secondary/50 border-border/50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        <SelectItem value="llama3-70b">Llama 3 70B (NIM)</SelectItem>
                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                        <SelectItem value="nemo-text">NeMo Text-to-Graph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">NVIDIA Compute</label>
                    <Select value={newAgentCompute} onValueChange={setNewAgentCompute}>
                      <SelectTrigger className="bg-secondary/50 border-border/50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        <SelectItem value="h100-nim">NVIDIA H100 (NIM)</SelectItem>
                        <SelectItem value="a100-perf">NVIDIA A100 Cluster</SelectItem>
                        <SelectItem value="rtx-local">Local RTX Engine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Chain of Thought</p>
                      <p className="text-[10px] text-muted-foreground">Self-reasoning output active</p>
                    </div>
                  </div>
                  <Switch checked={enableCoT} onCheckedChange={setEnableCoT} />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Connect App (optional)</label>
                  <Select value={newAgentIntegration} onValueChange={setNewAgentIntegration}>
                    <SelectTrigger className="bg-secondary/50 border-border/50 h-11">
                      <SelectValue placeholder="Select integration" />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-border/50">
                      <SelectItem value="Gmail">Gmail</SelectItem>
                      <SelectItem value="Slack">Slack</SelectItem>
                      <SelectItem value="Notion">Notion</SelectItem>
                      <SelectItem value="Jira">Jira</SelectItem>
                      <SelectItem value="GitHub">GitHub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 border-border/50">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAgent}
                    disabled={isCreating}
                    className="flex-1 bg-primary hover:bg-primary/90 glow-purple gap-2"
                  >
                    {isCreating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                    ) : (
                      <><Rocket className="w-4 h-4" /> Create Agent</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agents;
