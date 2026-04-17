import { motion } from "framer-motion";
import { Monitor, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

const gpuData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}s`,
  gpu: Math.floor(60 + Math.random() * 30),
  cpu: Math.floor(40 + Math.random() * 25),
  memory: Math.floor(50 + Math.random() * 20),
}));

const InfraMonitor = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-accent" />
          <h3 className="font-heading font-semibold text-lg">Widget C (Infrastructure Health)</h3>
        </div>
        <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent gap-1">
          <Zap className="w-3 h-3 fill-current" /> NVIDIA H100 Cluster Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpuData}>
                <defs>
                  <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(258, 100%, 69%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(258, 100%, 69%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'hsla(240, 12%, 8%, 0.95)',
                    border: '1px solid hsla(240, 10%, 20%, 0.5)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    backdropBlur: '4px'
                  }}
                />
                <Area type="monotone" dataKey="gpu" stroke="hsl(258, 100%, 69%)" fill="url(#gpuGrad)" strokeWidth={2} name="GPU Usage (NIM)" />
                <Area type="monotone" dataKey="cpu" stroke="hsl(185, 100%, 50%)" fill="url(#cpuGrad)" strokeWidth={2} name="Agent Load" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-6 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsla(258,100%,69%,0.5)]" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">GPU (AI Processing)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_hsla(185,100%,50%,0.5)]" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Agent Load</span>
            </div>
          </div>
        </div>

        {/* Compute Nodes */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Active Compute Nodes</p>
          {[
            { id: "NODE-NIM-01", type: "NVIDIA H100", load: "78%", status: "optimal" },
            { id: "NODE-NIM-02", type: "NVIDIA H100", load: "42%", status: "optimal" },
            { id: "NODE-VEC-01", type: "Vector Unit", load: "12%", status: "idle" },
          ].map((node) => (
            <div key={node.id} className="bg-secondary/20 border border-border/30 rounded-lg p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors">
              <div>
                <p className="text-xs font-bold font-heading">{node.id}</p>
                <p className="text-[10px] text-muted-foreground">{node.type}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-accent">{node.load}</p>
                <Badge variant="outline" className="h-4 text-[9px] px-1.5 border-success/30 text-success bg-success/5 uppercase font-bold">
                  {node.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InfraMonitor;
