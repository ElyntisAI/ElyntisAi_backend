import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Puzzle, CreditCard, Loader2, ScrollText, Key, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user, updateUser, updateUserPassword } = useAuth();
  const [twoFA, setTwoFA] = useState(false);
  
  // General State
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [workspace, setWorkspace] = useState("ElyntisAI Labs");
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSaveGeneral = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setIsSavingGeneral(true);
    try {
      await updateUser(name);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const code = error?.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Current password is incorrect. Please try again.");
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(error.message || "Failed to update password.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpgrade = () => {
    toast.info("Forwarding to Stripe billing portal... (Mock)", {
      description: "Our billing system is currently in sandbox mode."
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gradient-purple">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your workspace preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass border border-border/30 p-1 bg-secondary/30 flex w-full overflow-x-auto overflow-y-hidden no-scrollbar justify-start sm:justify-center">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5"><Settings className="w-3.5 h-3.5" /> General</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5"><Shield className="w-3.5 h-3.5" /> Security</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5"><Puzzle className="w-3.5 h-3.5" /> Integrations</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Billing</TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5"><ScrollText className="w-3.5 h-3.5" /> Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-secondary/50 border-border/50 h-11" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input 
                  value={email}
                  disabled
                  placeholder="email@example.com"
                  className="bg-secondary/10 border-border/30 h-11 opacity-70 cursor-not-allowed" 
                />
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">Email cannot be changed manually.</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Workspace Name</label>
              <Input 
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder="My Workspace"
                className="bg-secondary/50 border-border/50 h-11" 
              />
            </div>
            <Button 
              onClick={handleSaveGeneral}
              disabled={isSavingGeneral}
              className="bg-primary hover:bg-primary/90 glow-purple"
            >
              {isSavingGeneral ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-heading font-semibold mb-4">Change Password</h3>
              <div className="space-y-3 max-w-md">
                <Input 
                  type="password" 
                  placeholder="Current password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-secondary/50 border-border/50 h-11" 
                />
                <Input 
                  type="password" 
                  placeholder="New password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-secondary/50 border-border/50 h-11" 
                />
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary/50 border-border/50 h-11" 
                />
                <Button 
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : "Update Password"}
                </Button>
              </div>
            </div>
            <div className="border-t border-border/30 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security</p>
                </div>
                <Switch checked={twoFA} onCheckedChange={setTwoFA} />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="integrations">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6">
            <h3 className="font-heading font-semibold mb-4">Connected Apps</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {["Gmail", "Slack", "Notion", "Salesforce"].map((app) => (
                <div key={app} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30">
                  <div className="flex items-center gap-3">
                    <Puzzle className="w-5 h-5 text-primary" />
                    <span className="font-medium">{app}</span>
                  </div>
                  <Badge variant="outline" className="border-success/30 text-success text-xs">Connected</Badge>
                </div>
              ))}
            </div>


          </motion.div>
        </TabsContent>

        <TabsContent value="billing">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold">Current Plan: Pro</h3>
                <p className="text-sm text-muted-foreground mt-1">$49/month · Renews Jan 15, 2027</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleUpgrade}
                className="border-accent/30 text-accent hover:bg-accent/10"
              >
                Upgrade to Enterprise
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Agents Used</span><span>24 / 50</span></div>
                <Progress value={48} className="h-2 bg-secondary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Runs This Month</span><span>48.2K / 100K</span></div>
                <Progress value={48} className="h-2 bg-secondary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Storage Used</span><span>12.4 GB / 50 GB</span></div>
                <Progress value={25} className="h-2 bg-secondary" />
              </div>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="audit">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl overflow-hidden border-white/5">
            <div className="p-6 border-b border-white/5 bg-secondary/10 flex items-center justify-between">
              <h3 className="font-heading font-semibold">System Audit Logs</h3>

            </div>
            <div className="divide-y divide-white/5">
              {[
                { event: "Agent Deployed", user: "Admin", target: "SalesBot (H100)", time: "2m ago", status: "success" },
                { event: "Integration Updated", user: "Dev-02", target: "Slack API Key", time: "15m ago", status: "success" },
                { icon: Shield, event: "Security Bypass", user: "System", target: "Emergency HITL", time: "1h ago", status: "warning" },
                { event: "Billing Plan Changed", user: "Admin", target: "Pro -> Enterprise", time: "2h ago", status: "success" },
                { event: "Compute Scaling", user: "Auto-Scale", target: "Cluster-04 AddNode", time: "5h ago", status: "success" },
              ].map((log, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.status === 'warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {log.icon ? <log.icon className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{log.event}</p>
                      <p className="text-[10px] text-muted-foreground">User: {log.user} · Target: {log.target}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
