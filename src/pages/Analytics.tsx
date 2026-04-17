import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Zap, Clock } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Progress } from "@/components/ui/progress";

const executionData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  executions: Math.floor(800 + Math.random() * 600),
  success: Math.floor(750 + Math.random() * 500),
}));

const consumptionData = [
  { name: "SupportSwarm", tokens: 12400, cost: 24.80, success: 98.2 },
  { name: "SalesEngine", tokens: 8900, cost: 17.80, success: 94.5 },
  { name: "CodeAudit", tokens: 6200, cost: 12.40, success: 99.1 },
  { name: "ResearchHub", tokens: 3100, cost: 6.20, success: 96.4 },
];

const hardwarePerf = [
  { hardware: "NVIDIA H100", speed: 100, accuracy: 99.8, cost: 1.2 },
  { hardware: "NVIDIA A100", speed: 75, accuracy: 98.2, cost: 0.8 },
  { hardware: "NVIDIA RTX 4090", speed: 60, accuracy: 96.5, cost: 0.4 },
  { hardware: "AWS Inferentia", speed: 45, accuracy: 92.1, cost: 0.2 },
];

const COLORS = ["hsl(258, 100%, 69%)", "hsl(185, 100%, 50%)", "hsl(152, 100%, 50%)", "hsl(38, 92%, 50%)"];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gradient-purple">Intelligence Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into NIM cluster ROI and agent swarm performance</p>
        </div>
        <div className="flex items-center gap-2 bg-success/10 border border-success/20 px-4 py-2 rounded-xl">
          <BarChart3 className="w-5 h-5 text-success" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-success uppercase tracking-widest">Efficiency Rating</p>
            <p className="text-xs font-medium">9.4/10 Alpha</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Zap, label: "Total Tokens", value: "2.4M", change: "+14.2%" },
          { icon: TrendingUp, label: "Success Rate", value: "98.8%", change: "+0.4%" },
          { icon: Clock, label: "Avg Latency", value: "118ms", change: "-24ms" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 lg:col-span-2">
          <h3 className="font-heading font-semibold text-lg mb-4">Execution Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executionData}>
                <defs>
                  <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(258, 100%, 69%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(258, 100%, 69%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsla(240, 12%, 8%, 0.95)', border: '1px solid hsla(240, 10%, 20%, 0.5)', borderRadius: '12px', fontSize: '11px', backdropBlur: '4px' }} />
                <Area type="monotone" dataKey="executions" stroke="hsl(258, 100%, 69%)" fill="url(#execGrad)" strokeWidth={3} name="Inference Ops" />
                <Area type="monotone" dataKey="tokens" stroke="hsl(185, 100%, 50%)" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Token Burn" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold text-lg mb-4">Swarms by Consumption</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: 'hsla(240, 12%, 8%, 0.95)', border: '1px solid hsla(240, 10%, 20%, 0.5)', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="tokens" fill="hsl(185, 100%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {consumptionData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-bold text-accent">${item.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hardware Performance Matrix */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6">
        <h3 className="font-heading font-semibold text-lg mb-6">NVIDIA NIM Hardware Correlation Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {hardwarePerf.map((item) => (
            <div key={item.hardware} className="p-4 rounded-xl bg-secondary/20 border border-white/5 space-y-3">
              <p className="text-xs font-bold font-heading text-accent">{item.hardware}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-widest">
                    <span>Performance</span>
                    <span className="text-foreground">{item.speed}%</span>
                  </div>
                  <Progress value={item.speed} className="h-1 bg-secondary" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-widest">
                    <span>Accuracy</span>
                    <span className="text-foreground">{item.accuracy}%</span>
                  </div>
                  <Progress value={item.accuracy} className="h-1 bg-secondary" />
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Relative Cost</span>
                <span className="text-sm font-bold">${item.cost}/hr</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
