import { motion } from "framer-motion";
import { ShieldAlert, Check, X, FileSearch, UserCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

const initialRequests = [
  { id: 1, agent: "SalesBot", action: "Send Campaign Email", details: "Recipient: ceo@partner.com", tokens: "420", priority: "high" },
  { id: 2, agent: "DevHelper", action: "Execute SQL Migration", details: "Table: production_users", tokens: "1.2K", priority: "critical" },
  { id: 3, agent: "SupportAI", action: "Issue Refund", details: "Amount: $129.00", tokens: "85", priority: "medium" },
];

const ApprovalQueue = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleAction = (id: number, type: "approve" | "reject") => {
    const req = requests.find(r => r.id === id);
    setRequests(prev => prev.filter(r => r.id !== id));
    toast(type === 'approve' ? "Action Approved" : "Action Blocked", {
      description: `${req?.agent}: ${req?.action}`,
      icon: type === 'approve' ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-destructive" />
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-6 border-accent/20 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-accent" />
          <h3 className="font-heading font-semibold text-lg">HITL Approval Queue</h3>
        </div>
        <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent animate-pulse">
          {requests.length} Pending
        </Badge>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-8">
            <ShieldAlert className="w-12 h-12 mb-2" />
            <p className="text-sm">Queue cleared. All agents authorized.</p>
          </div>
        ) : (
          requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-secondary/20 border border-border/30 rounded-xl p-4 hover:bg-secondary/30 transition-all border-l-4"
              style={{ borderLeftColor: req.priority === 'critical' ? 'hsl(0, 100%, 50%)' : req.priority === 'high' ? 'hsl(25, 100%, 50%)' : 'hsl(185, 100%, 50%)' }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-accent uppercase tracking-tighter">{req.agent}</p>
                    <Badge className="text-[8px] h-3 px-1 bg-secondary text-muted-foreground">NIM-H100</Badge>
                  </div>
                  <h4 className="text-sm font-bold font-heading">{req.action}</h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase">Tokens</p>
                  <p className="text-xs font-mono font-bold">{req.tokens}</p>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-2 mb-3 border border-white/5 flex items-start gap-2">
                <FileSearch className="w-3 h-3 text-muted-foreground mt-0.5" />
                <p className="text-[10px] text-muted-foreground line-clamp-1 italic">{req.details}</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAction(req.id, "reject")}
                  className="flex-1 h-8 text-[11px] border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <X className="w-3 h-3 mr-1" /> Block
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleAction(req.id, "approve")}
                  className="flex-1 h-8 text-[11px] bg-accent hover:bg-accent/90 text-white"
                >
                  <Check className="w-3 h-3 mr-1" /> Authorize
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <MessageSquare className="w-3 h-3" />
          <span>Feedback loop active</span>
        </div>
        <button className="text-[10px] text-accent hover:underline font-bold uppercase tracking-wider">Configure Guardrails</button>
      </div>
    </motion.div>
  );
};

export default ApprovalQueue;
