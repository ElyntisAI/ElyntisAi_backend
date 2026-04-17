import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Check, Plus, X, Loader2, Zap, Trash2, Settings2, ShieldCheck, RefreshCcw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialIntegrations = [
  { id: 1, name: "Gmail", description: "Email automation and classification", connected: true, category: "Communication", icon: "📧", lastSync: "2m ago" },
  { id: 2, name: "Slack", description: "Team notifications and alerts", connected: true, category: "Communication", icon: "💬", lastSync: "5s ago" },
  { id: 3, name: "Notion", description: "Knowledge base and documentation", connected: true, category: "Productivity", icon: "📝", lastSync: "1h ago" },
  { id: 4, name: "GitHub", description: "Code repository and CI/CD", connected: false, category: "Development", icon: "🐱", lastSync: "N/A" },
  { id: 5, name: "Jira", description: "Project management and tracking", connected: false, category: "Productivity", icon: "🎯", lastSync: "N/A" },
  { id: 6, name: "Salesforce", description: "CRM and sales pipeline", connected: true, category: "Business", icon: "☁️", lastSync: "12m ago" },
  { id: 7, name: "Stripe", description: "Payment processing and billing", connected: false, category: "Business", icon: "💳", lastSync: "N/A" },
  { id: 8, name: "HubSpot", description: "Marketing automation", connected: false, category: "Marketing", icon: "🔶", lastSync: "N/A" },
];

const Integrations = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [configuring, setConfiguring] = useState<typeof initialIntegrations[0] | null>(null);
  const [apiKey, setApiKey] = useState("");

  const handleToggle = async (id: number) => {
    const integration = integrations.find((i) => i.id === id);
    if (!integration) return;

    // If connected, show configure modal instead of disconnect on button click
    if (integration.connected) {
      setConfiguring(integration);
      return;
    }

    // Connect flow
    setLoadingId(id);
    await new Promise((r) => setTimeout(r, 1400));
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: true } : i))
    );
    toast.success(`${integration.name} connected successfully!`, {
      description: "You can now use it in your AI agents.",
    });
    setLoadingId(null);
  };

  const handleDisconnect = async (id: number) => {
    const integration = integrations.find((i) => i.id === id);
    if (!integration) return;

    setLoadingId(id);
    setConfiguring(null);
    await new Promise((r) => setTimeout(r, 900));
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: false } : i))
    );
    toast.success(`${integration.name} disconnected.`);
    setLoadingId(null);
  };

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    toast.success(`${configuring?.name} configuration saved!`, {
      description: "API key has been updated.",
    });
    setApiKey("");
    setConfiguring(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gradient-purple">App Engine Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect your workspace tools to autonomous NVIDIA NIM agents</p>
        </div>
        <div className="flex items-center gap-3 bg-success/10 border border-success/20 px-4 py-2 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-success" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-success uppercase tracking-widest">Security Status</p>
            <p className="text-xs font-medium">AES-256 Vault Encrypted</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((int, i) => {
          const isLoading = loadingId === int.id;
          return (
            <motion.div
              key={int.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:glow-border-purple transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                  {int.icon}
                </div>
                {int.connected && (
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="border-success/30 text-success text-[10px] h-5 bg-success/5">
                      <Check className="w-2.5 h-2.5 mr-1" /> Active
                    </Badge>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <RefreshCcw className="w-2.5 h-2.5 animate-spin-slow" /> {int.lastSync}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="font-heading font-semibold">{int.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{int.description}</p>
              <Button
                onClick={() => handleToggle(int.id)}
                disabled={isLoading}
                variant={int.connected ? "outline" : "default"}
                size="sm"
                className={int.connected
                  ? "w-full border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
                  : "w-full bg-primary hover:bg-primary/90 glow-purple gap-1.5"
                }
              >
                {isLoading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...</>
                ) : int.connected ? (
                  <><Settings2 className="w-3.5 h-3.5" /> Configure</>
                ) : (
                  <><Zap className="w-3.5 h-3.5" /> Connect</>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Configure Modal */}
      <AnimatePresence>
        {configuring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setConfiguring(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-strong rounded-2xl p-8 w-full max-w-md mx-4 glow-border-purple space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                    {configuring.icon}
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-lg">{configuring.name}</h2>
                    <p className="text-xs text-muted-foreground">{configuring.category}</p>
                  </div>
                </div>
                <button onClick={() => setConfiguring(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-success">Connected & Active</span>
                <Badge variant="outline" className="ml-auto border-success/30 text-success text-xs">Live</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">API Key / Token</label>
                  <Input
                    type="password"
                    placeholder="Update API key (leave blank to keep current)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-secondary/50 border-border/50 h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleDisconnect(configuring.id)}
                  disabled={loadingId === configuring.id}
                  className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  {loadingId === configuring.id
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Disconnecting...</>
                    : <><Trash2 className="w-4 h-4" /> Disconnect</>
                  }
                </Button>
                <Button
                  onClick={handleSaveConfig}
                  className="flex-1 bg-primary hover:bg-primary/90 glow-purple gap-2"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Integrations;

