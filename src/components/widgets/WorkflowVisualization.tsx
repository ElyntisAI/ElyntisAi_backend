import { motion } from "framer-motion";
import { GitBranch, Mail, MessageSquare, Database, Brain, ArrowRight } from "lucide-react";

import { Shield, Hammer, Search, Cpu, LucideIcon } from "lucide-react";

interface Node {
  icon: LucideIcon;
  label: string;
  x: number;
  y: number;
  role: string;
}

const nodes: Node[] = [
  { icon: Search, label: "Swarm Architect", x: 10, y: 30, role: "Planning" },
  { icon: Cpu, label: "Neural Executor", x: 35, y: 15, role: "Processing" },
  { icon: Hammer, label: "Task Handler", x: 60, y: 5, role: "Execution" },
  { icon: Shield, label: "Security Guard", x: 60, y: 45, role: "Validation" },
  { icon: Brain, label: "Quality Reviewer", x: 85, y: 25, role: "Auditing" },
];

const edges = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
];

const WorkflowVisualization = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-xl p-6 glow-border-cyan"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-accent" />
          <h3 className="font-heading font-semibold text-lg">Widget B (Agent Swarm Collaboration)</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
          Powered by NVIDIA NIM SDK
        </span>
      </div>

      {/* Workflow graph */}
      <div className="relative h-56 rounded-xl bg-secondary/10 border border-border/30 overflow-hidden group">
        {/* Connection Lines (Edges) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, i) => {
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            return (
              <g key={i}>
                {/* Background static line */}
                <line
                  x1={`${from.x + 4}%`} y1={`${from.y + 7}%`}
                  x2={`${to.x + 4}%`} y2={`${to.y + 7}%`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-border/20"
                />
                {/* Animated pulse line */}
                <line
                  x1={`${from.x + 4}%`} y1={`${from.y + 7}%`}
                  x2={`${to.x + 4}%`} y2={`${to.y + 7}%`}
                  stroke="hsl(185, 100%, 50%)"
                  strokeWidth="2"
                  strokeDasharray="8 12"
                  className="blur-[1px] opacity-60"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="100" to="0" 
                    dur={`${2 + i * 0.5}s`} 
                    repeatCount="indefinite" 
                  />
                </line>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="absolute flex flex-col items-center group/node"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center hover:glow-border-cyan transition-all cursor-pointer backdrop-blur-md relative z-10 hover:-translate-y-1 active:scale-95 duration-200">
                <node.icon className="w-6 h-6 text-accent group-hover/node:text-white transition-colors" />
              </div>
              
              {/* Active Indicator Pulse */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-glow z-20 border-2 border-background" />

              {/* Tooltip / Context (on hover) */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-background/95 border border-border/50 px-3 py-2 rounded-xl text-[10px] font-medium backdrop-blur-md shadow-2xl z-50">
                <p className="text-accent font-bold uppercase tracking-widest mb-1">{node.role}</p>
                <div className="flex gap-2 text-muted-foreground">
                  <span>Success: <span className="text-success font-bold">99.8%</span></span>
                  <span>|</span>
                  <span>Tokens: <span className="text-primary font-bold">128/s</span></span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground mt-2 font-medium bg-secondary/30 px-2 py-0.5 rounded-full">{node.label}</span>
          </motion.div>
        ))}

        {/* Dynamic Overlay Label */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/60 backdrop-blur-md border border-border/30 px-3 py-1 rounded-full pointer-events-none">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-accent">Active Swarm Protocol: NIM-v2</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowVisualization;
