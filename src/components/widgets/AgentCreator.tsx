import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AgentCreator = () => {
  const [agentName, setAgentName] = useState("");
  const [task, setTask] = useState("");
  const [integration, setIntegration] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!agentName.trim()) {
      toast.error("Please enter an agent name");
      return;
    }
    if (!task.trim()) {
      toast.error("Please enter a task definition");
      return;
    }

    setIsDeploying(true);
    try {
      // Simulate deployment (replace with real API call when backend is ready)
      await new Promise((resolve) => setTimeout(resolve, 1800));
      toast.success(`Agent "${agentName}" deployed successfully!`, {
        description: integration
          ? `Connected to ${integration.charAt(0).toUpperCase() + integration.slice(1)}`
          : "Running in standalone mode",
      });
      // Reset form
      setAgentName("");
      setTask("");
      setIntegration("");
    } catch (error) {
      toast.error("Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-xl p-6 glow-border-purple"
    >
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-lg">Widget A (Input)</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Agent Name</label>
          <Input
            placeholder="e.g. Email Classifier Agent"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="bg-secondary/50 border-border/50 h-10"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Task Definition</label>
          <Input
            placeholder="Classify incoming emails and route to teams"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="bg-secondary/50 border-border/50 h-10"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Connect Apps</label>
          <Select value={integration} onValueChange={setIntegration}>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Select integration (optional)" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-border/50">
              <SelectItem value="gmail">Gmail</SelectItem>
              <SelectItem value="slack">Slack</SelectItem>
              <SelectItem value="notion">Notion</SelectItem>
              <SelectItem value="jira">Jira</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-purple gap-2"
        >
          {isDeploying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Deploy Agent
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default AgentCreator;
