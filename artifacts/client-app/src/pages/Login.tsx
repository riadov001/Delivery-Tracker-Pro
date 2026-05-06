import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, register, isLoading } = useAuth();
  const [, navigate] = useLocation();

  const submit = async () => {
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/profile");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full" />
          <div className="absolute top-4 -right-4 w-24 h-24 bg-white rounded-full" />
        </div>
        <button onClick={() => navigate("/")} className="bg-white/20 rounded-full p-2 mb-6 relative">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="relative">
          <h1 className="text-white font-bold text-2xl leading-tight">
            {mode === "login" ? "Welcome back! 👋" : "Create account 🎉"}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {mode === "login"
              ? "Sign in to continue ordering"
              : "Join us and enjoy great food"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-card -mt-8 rounded-t-3xl px-6 pt-8 pb-12 space-y-4 shadow-2xl">
        {/* Toggle */}
        <div className="flex bg-muted rounded-2xl p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "login" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "register" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            Register
          </button>
        </div>

        {mode === "register" && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-muted text-foreground rounded-xl px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full bg-muted text-foreground rounded-xl px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "register" ? "Min 8 characters" : "Your password"}
              className="w-full bg-muted text-foreground rounded-xl px-4 py-3.5 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {mode === "login" && (
          <button className="text-primary text-sm font-semibold text-right w-full">
            Forgot password?
          </button>
        )}

        <button
          onClick={submit}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base disabled:opacity-60 mt-2"
        >
          {isLoading
            ? mode === "login" ? "Signing in..." : "Creating account..."
            : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-muted-foreground text-sm pt-2">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-primary font-bold"
          >
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
