import { motion } from "framer-motion";
import { Cpu, Zap, Activity, ShieldCheck, Thermometer, HardDrive, Server, Gauge, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const performanceData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  load: Math.floor(40 + Math.random() * 50),
  temp: Math.floor(65 + Math.random() * 15),
}));

const clusters = [
  { 
    id: "NIM-NODE-01", 
    type: "NVIDIA H100 (80GB)", 
    status: "optimal", 
    vram: 64, 
    temp: 72, 
    power: "420W", 
    uptime: "14d 2h",
    utilization: 78
  },
  { 
    id: "NIM-NODE-02", 
    type: "NVIDIA H100 (80GB)", 
    status: "optimal", 
    vram: 32, 
    temp: 68, 
    power: "380W", 
    uptime: "14d 2h",
    utilization: 42
  },
  { 
    id: "VEC-NODE-01", 
    type: "Vector Unit (A100)", 
    status: "high-load", 
    vram: 78, 
    temp: 84, 
    power: "450W", 
    uptime: "5d 1h",
    utilization: 94
  },
];

const Infrastructure = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gradient-purple">Infrastructure Hub</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor high-performance NVIDIA NIM clusters</p>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl">
          <Server className="w-5 h-5 text-accent" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Global Compute</p>
            <p className="text-xs font-medium">16x H100 Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Gauge, label: "Total VRAM", value: "1.2 TB", status: "82% Used" },
          { icon: Box, label: "Active Nodes", value: "12 / 16", status: "Scaling Active" },
          { icon: Activity, label: "Throughput", value: "48K req/s", status: "Optimal" },
          { icon: ShieldCheck, label: "System Health", value: "99.99%", status: "No Issues" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 border-white/5 bg-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.status}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg">Cluster-Wide Load History</h3>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-primary/30 text-primary">Inference</Badge>
              <Badge variant="outline" className="border-accent/30 text-accent">Training</Badge>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(258, 100%, 69%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(258, 100%, 69%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'hsla(240, 12%, 8%, 0.95)', border: '1px solid hsla(240, 10%, 20%, 0.5)', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="load" stroke="hsl(258, 100%, 69%)" fill="url(#loadGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Node Status Sidebar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="space-y-4">
          <h3 className="font-heading font-semibold text-lg px-1">Active Clusters</h3>
          {clusters.map((cluster) => (
            <div key={cluster.id} className="glass rounded-xl p-5 border-white/5 hover:glow-border-purple transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading font-bold text-sm tracking-tight">{cluster.id}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{cluster.type}</p>
                </div>
                <Badge variant="outline" className={`${cluster.status === 'optimal' ? 'border-success/30 text-success bg-success/5' : 'border-warning/30 text-warning bg-warning/5'} text-[10px] px-2 h-5`}>
                  {cluster.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Utilization</span>
                    <span className="text-foreground">{cluster.utilization}%</span>
                  </div>
                  <Progress value={cluster.utilization} className="h-1.5 bg-secondary" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{cluster.temp}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{cluster.power}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{cluster.vram}% VRAM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{cluster.uptime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Infrastructure;
