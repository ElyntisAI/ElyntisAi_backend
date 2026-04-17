import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bot, GitBranch, Puzzle, BarChart3, Settings,
  Search, Bell, ChevronLeft, ChevronRight, LogOut, User, Zap,
  Command, Database, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CommandPalette from "./CommandPalette";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Bot, label: "AI Agents", path: "/agents" },
  { icon: GitBranch, label: "Workflows", path: "/workflows" },
  { icon: Puzzle, label: "Integrations", path: "/integrations" },
  { icon: Database, label: "Infrastructure", path: "/infrastructure" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setShowLogout(false);
  };

  return (
    <div className="min-h-screen flex bg-background bg-grid">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ 
          width: collapsed ? 72 : 240,
        }}
        initial={false}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="ElyntisAI" className="w-8 h-8 object-contain" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 font-heading font-bold text-lg text-gradient-purple whitespace-nowrap overflow-hidden"
                >
                  ElyntisAI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-sidebar-foreground hover:text-foreground md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  active
                    ? "bg-primary/10 text-primary glow-border-purple"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse (Desktop Only) */}
        <div className="p-2 border-t border-sidebar-border hidden md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 text-sidebar-foreground hover:text-foreground transition-colors rounded-lg hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "md:ml-[72px]" : "md:ml-[240px]"}`}>
        {/* Top Navbar */}
        <header className="h-16 border-b border-border glass-strong sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => setShowCommand(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all w-72"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-auto text-xs bg-secondary px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowCommand(true)}
              className="p-2 text-muted-foreground hover:text-foreground sm:hidden"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-border-purple uppercase overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.displayName ? user.displayName.charAt(0) : user?.email?.charAt(0) || <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col items-start mr-2 hidden xs:flex">
                    <span className="text-xs font-semibold text-foreground leading-none">{user?.displayName || 'User'}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight truncate max-w-[100px]">{user?.email}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-strong border-border/50">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogout(true)} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
        <AlertDialogContent className="glass-strong border-border/50 glow-border-purple">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Terminate Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign you out of ElyntisAI Command Center. All running agents will continue operating.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary/50 border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              Terminate Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Command Palette */}
      <CommandPalette open={showCommand} onOpenChange={setShowCommand} />
    </div>
  );
};

export default DashboardLayout;
