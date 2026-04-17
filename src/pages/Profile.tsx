import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail, Shield, Check, Pencil, X, Loader2, Save,
  Camera, Eye, EyeOff, Lock, Palette, Sun, Moon, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useAppearance } from "@/contexts/AppearanceContext";
import { toast } from "sonner";

const ACCENT_COLORS = [
  { name: "Purple", value: "purple", primary: "#a855f7", css: "hsl(270 91% 65%)" },
  { name: "Blue",   value: "blue",   primary: "#3b82f6", css: "hsl(217 91% 60%)" },
  { name: "Cyan",   value: "cyan",   primary: "#06b6d4", css: "hsl(189 94% 43%)" },
  { name: "Green",  value: "green",  primary: "#22c55e", css: "hsl(142 71% 45%)" },
  { name: "Pink",   value: "pink",   primary: "#ec4899", css: "hsl(330 81% 60%)" },
  { name: "Orange", value: "orange", primary: "#f97316", css: "hsl(25 95% 53%)" },
];

const Profile = () => {
  const { user, updateUser, updateUserPassword, logout } = useAuth();

  // === Avatar state ===
  const [avatarSrc, setAvatarSrc] = useState<string | null>(user?.photoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === Name editing ===
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isSavingName, setIsSavingName] = useState(false);

  // === Password change ===
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  // === Appearance ===
  const { theme, setTheme, accentColor, setAccentColor } = useAppearance();

  // Sync name state when user changes
  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
    if (user?.photoURL) setAvatarSrc(user.photoURL);
  }, [user?.displayName, user?.photoURL]);

  // Avatar initials fallback
  const initials = (user?.displayName || user?.email || "U")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  // === Handlers ===
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const size = 150;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const minD = Math.min(img.width, img.height);
          const startX = (img.width - minD) / 2;
          const startY = (img.height - minD) / 2;
          ctx.drawImage(img, startX, startY, minD, minD, 0, 0, size, size);
          const optimizedUrl = canvas.toDataURL("image/jpeg", 0.7);
          
          try {
            // First display locally for immediate feedback
            setAvatarSrc(optimizedUrl);
            
            await updateUser(displayName, optimizedUrl);
            toast.success("Profile picture updated!");
          } catch (err: any) {
            toast.error(err.message || "Failed to save profile picture");
          }
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) { toast.error("Name cannot be empty"); return; }
    setIsSavingName(true);
    try {
      await updateUser(displayName);
      toast.success("Display name updated!");
      setIsEditingName(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update name");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword) { toast.error("Enter your current password"); return; }
    if (!newPassword) { toast.error("Enter a new password"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setIsSavingPwd(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e: any) {
      const code = e?.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(e.message || "Failed to update password.");
      }
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleThemeChange = (t: "dark" | "light" | "system") => {
    setTheme(t);
    toast.success(`Theme set to ${t}`);
  };

  const handleAccentChange = (color: typeof ACCENT_COLORS[0]) => {
    setAccentColor(color.value as any);
    toast.success(`Accent color set to ${color.name}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gradient-purple">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account, appearance and security</p>
      </div>

      {/* ── Profile Card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 glow-border-purple">
        <div className="flex items-start gap-5">

          {/* Avatar upload */}
          <div className="relative shrink-0 group">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden glow-border-purple">
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-primary">{initials}</span>
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              title="Change photo"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Inline name edit */}
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-1">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="bg-secondary/50 border-border/50 h-9 font-bold text-lg"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveName} disabled={isSavingName} className="bg-primary hover:bg-primary/90 h-9">
                  {isSavingName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setIsEditingName(false); setDisplayName(user?.displayName || ""); }} className="h-9 border-border/50">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-heading font-bold">{user?.displayName || "User"}</h2>
                <button onClick={() => setIsEditingName(true)} className="text-muted-foreground hover:text-primary transition-colors" title="Edit name">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <Mail className="w-3 h-3" /> {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="border-primary/30 text-primary"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>
              {user?.emailVerified && <Badge variant="outline" className="border-success/30 text-success"><Check className="w-3 h-3 mr-1" /> Verified</Badge>}
            </div>
          </div>
        </div>

        {/* Photo hint */}
        <p className="text-xs text-muted-foreground mt-4 ml-1">
          <Camera className="w-3 h-3 inline mr-1" />
          Hover over your avatar to change your profile picture
        </p>
      </motion.div>

      {/* ── Change Password ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold text-lg">Change Password</h3>
        </div>
        <div className="space-y-3 max-w-md">
          {/* Current */}
          <div className="relative">
            <label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
            <Input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-secondary/50 border-border/50 h-11 pr-10"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-[2.1rem] text-muted-foreground hover:text-foreground transition-colors">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* New */}
          <div className="relative">
            <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
            <Input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-secondary/50 border-border/50 h-11 pr-10"
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-[2.1rem] text-muted-foreground hover:text-foreground transition-colors">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Confirm */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-secondary/50 border-border/50 h-11"
            />
          </div>

          {/* Strength bar */}
          {newPassword && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                    newPassword.length >= i * 2 + 2
                      ? i < 2 ? "bg-destructive" : i < 3 ? "bg-warning" : "bg-success"
                      : "bg-secondary"
                  }`} />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {newPassword.length < 6 ? "Too short" : newPassword.length < 8 ? "Weak" : newPassword.length < 12 ? "Good" : "Strong"}
              </p>
            </div>
          )}

          <Button onClick={handleSavePassword} disabled={isSavingPwd} className="bg-primary hover:bg-primary/90 glow-purple gap-2">
            {isSavingPwd ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><Lock className="w-4 h-4" /> Update Password</>}
          </Button>
        </div>
      </motion.div>

      {/* ── Appearance ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold text-lg">Appearance</h3>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Theme</label>
          <div className="flex gap-3">
            {([
              { key: "dark", label: "Dark", icon: Moon },
              { key: "light", label: "Light", icon: Sun },
              { key: "system", label: "System", icon: Monitor },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  theme === key
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/30 bg-secondary/10 text-muted-foreground hover:border-border/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
                {theme === key && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">Accent Color</label>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentChange(color)}
                title={color.name}
                className={`relative w-10 h-10 rounded-xl transition-all border-2 ${
                  accentColor === color.value ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.primary }}
              >
                {accentColor === color.value && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Selected: <span className="text-foreground font-medium">{ACCENT_COLORS.find(c => c.value === accentColor)?.name}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
