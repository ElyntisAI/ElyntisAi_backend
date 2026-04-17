import { motion, AnimatePresence } from "framer-motion";
import { Clock, Brain, Cpu, Database, ChevronRight, X, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mockSteps = [
  { 
    id: 1, 
    type: "Input Received", 
    content: "Customer asked: 'How do I upgrade my H100 cluster?'",
    icon: Database,
    timestamp: "10:04:12"
  },
  { 
    id: 2, 
    type: "NIM Inference", 
    content: "Thought: Analyzed CRM data. User is tier-3. Path: Upgrade documentation -> Hardware availability.", 
    icon: Brain,
    timestamp: "10:04:13"
  },
  { 
    id: 3, 
    type: "App Execution", 
    content: "Action: Fetched 'NVIDIA-PaaS-H100-Guide.pdf' from Notion Knowledge Base.", 
    icon: Cpu,
    timestamp: "10:04:15"
  },
  { 
    id: 4, 
    type: "Self-Correction", 
    content: "Observation: PDF link is outdated (v2.1). Triggering search for v2.4 (Latest).", 
    icon: RotateCcw,
    timestamp: "10:04:16",
    resilient: true
  },
  { 
    id: 5, 
    type: "Final Response", 
    content: "Response Sent: Provided v2.4 guide and link to enterprise sales portal.", 
    icon: Play,
    timestamp: "10:04:18"
  },
];

const AgentTimeMachine = ({ isOpen, onClose, agentName = "Email Classifier" }: { isOpen: boolean, onClose: () => void, agentName?: string }) => {
  const [currentStep, setCurrentStep] = useState(mockSteps.length - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-strong rounded-3xl w-full max-w-2xl overflow-hidden border-accent/30 shadow-[0_0_50px_hsla(185,100%,50%,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold">Agent Time Machine</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Replaying Session of <span className="text-accent">{agentName}</span></p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Exit Replay"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Timeline Area */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 h-[400px]">
              {/* Stepper Sidebar */}
              <div className="md:col-span-4 space-y-4 border-r border-white/5 pr-4 overflow-y-auto custom-scrollbar">
                {mockSteps.map((step, i) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(i)}
                    className={`w-full text-left p-3 rounded-xl transition-all relative group ${currentStep === i ? 'bg-accent/20 border-accent/30' : 'hover:bg-white/5 border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentStep === i ? 'bg-accent text-white' : 'bg-secondary/50 text-muted-foreground'}`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${currentStep === i ? 'text-accent' : 'text-muted-foreground'}`}>{step.type}</p>
                        <p className="text-[10px] text-muted-foreground">{step.timestamp}</p>
                      </div>
                    </div>
                    {currentStep === i && (
                      <motion.div layoutId="activeStep" className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-l" />
                    )}
                    {step.resilient && (
                      <Badge className="absolute -top-1 -right-1 text-[8px] h-3 px-1.5 bg-primary group-hover:bg-primary/90">Healed</Badge>
                    )}
                  </button>
                ))}
              </div>

              {/* Data Detail Area */}
              <div className="md:col-span-8 flex flex-col justify-center gap-4">
                <div className="glass rounded-2xl p-6 border-white/5 space-y-4 relative">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-accent text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">
                    Inference Output
                  </div>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm font-medium leading-relaxed text-foreground/90 italic">
                      "{mockSteps[currentStep].content}"
                    </p>
                    <div className="flex gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold text-accent">Confidence</p>
                        <p className="text-sm font-bold">98.4%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold text-accent">Tokens</p>
                        <p className="text-sm font-bold">243</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold text-accent">NIM Node</p>
                        <p className="text-sm font-bold font-mono">H100-US-02</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={currentStep === 0} 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="text-muted-foreground hover:text-accent"
                  >
                    Previous Step
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={currentStep === mockSteps.length - 1} 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="text-muted-foreground hover:text-accent"
                  >
                    Next Step <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-center gap-4">
              <Button onClick={() => setCurrentStep(0)} variant="outline" size="sm" className="h-8 border-white/20">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Replay
              </Button>
              <Button onClick={onClose} size="sm" className="h-8 bg-accent hover:bg-accent/90">
                Close Inspector
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgentTimeMachine;
