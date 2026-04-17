import SystemOverview from "@/components/widgets/SystemOverview";
import AgentCreator from "@/components/widgets/AgentCreator";
import WorkflowVisualization from "@/components/widgets/WorkflowVisualization";
import InfraMonitor from "@/components/widgets/InfraMonitor";
import ActivityLog from "@/components/widgets/ActivityLog";
import ActiveWorkflows from "@/components/widgets/ActiveWorkflows";
import ApprovalQueue from "@/components/widgets/ApprovalQueue";
import ErrorPanel from "@/components/widgets/ErrorPanel";

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gradient-purple">Next-Gen AI Agent Platform</h1>
        <p className="text-muted-foreground mt-1">A platform to create and deploy autonomous AI agents that can perform tasks across apps.</p>
      </div>

      <SystemOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentCreator />
        <WorkflowVisualization />
      </div>

      <InfraMonitor />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityLog />
        <ApprovalQueue />
        <ErrorPanel />
      </div>
    </div>
  );
};

export default Index;
