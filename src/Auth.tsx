import React, { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

interface AuthError {
  field?: string;
  message: string;
}

// ─── Backend Hook Stubs ───────────────────────────────────────────────────────
const useAuth = () => {
  const signIn = async (data: AuthFormData): Promise<void> => {
    // TODO: POST /api/auth/signin → { email, password }
    // Returns: { token, user } | throws AuthError
    console.log("[AUTH] signIn →", data);
  };

  const signUp = async (data: AuthFormData): Promise<void> => {
    // TODO: POST /api/auth/signup → { email, password, displayName }
    // Returns: { token, user } | throws AuthError
    console.log("[AUTH] signUp →", data);
  };

  const signInWithGoogle = async (): Promise<void> => {
    // TODO: Redirect to /api/auth/google (OAuth2 flow)
    // Firebase: signInWithPopup(auth, new GoogleAuthProvider())
    // Supabase: supabase.auth.signInWithOAuth({ provider: 'google' })
    console.log("[AUTH] Google OAuth →");
  };

  const signInWithGithub = async (): Promise<void> => {
    // TODO: Redirect to /api/auth/github (OAuth2 flow)
    // Firebase: signInWithPopup(auth, new GithubAuthProvider())
    // Supabase: supabase.auth.signInWithOAuth({ provider: 'github' })
    console.log("[AUTH] GitHub OAuth →");
  };

  const forgotPassword = async (email: string): Promise<void> => {
    // TODO: POST /api/auth/forgot-password → { email }
    console.log("[AUTH] forgotPassword →", email);
  };

  return { signIn, signUp, signInWithGoogle, signInWithGithub, forgotPassword };
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Auth: React.FC = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [animKey, setAnimKey] = useState(0);

  const { signIn, signUp, signInWithGoogle, signInWithGithub, forgotPassword } = useAuth();

  useEffect(() => {
    setErrors([]);
    setSuccessMsg("");
    setShowPassword(false);
    setShowConfirm(false);
    setFormData({ email: "", password: "", confirmPassword: "", displayName: "" });
    setAnimKey((k) => k + 1);
  }, [mode]);

  const validate = (): AuthError[] => {
    const errs: AuthError[] = [];
    if (!formData.email) errs.push({ field: "email", message: "Email is required" });
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.push({ field: "email", message: "Enter a valid email" });
    if (mode !== "forgot") {
      if (!formData.password) errs.push({ field: "password", message: "Password is required" });
      else if (formData.password.length < 8) errs.push({ field: "password", message: "Minimum 8 characters" });
    }
    if (mode === "signup") {
      if (!formData.displayName) errs.push({ field: "displayName", message: "Name is required" });
      if (formData.password !== formData.confirmPassword)
        errs.push({ field: "confirmPassword", message: "Passwords don't match" });
    }
    return errs;
  };

  const fieldError = (field: string) => errors.find((e) => e.field === field)?.message;
  const globalError = errors.find((e) => !e.field)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setIsLoading(true);
    setErrors([]);
    try {
      if (mode === "signin") await signIn(formData);
      else if (mode === "signup") await signUp(formData);
      else { await forgotPassword(formData.email); setSuccessMsg("Reset link sent — check your inbox."); }
    } catch (err: any) {
      setErrors([{ message: err?.message ?? "Something went wrong. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setErrors([]);
    try {
      if (provider === "google") await signInWithGoogle();
      else await signInWithGithub();
    } catch (err: any) {
      setErrors([{ message: err?.message ?? "OAuth failed. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof AuthFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
    setErrors((prev) => prev.filter((er) => er.field !== field));
  };

  const titles = {
    signin: { heading: "Welcome back", sub: "Sign in to your account" },
    signup: { heading: "Create account", sub: "Join EventsMap today" },
    forgot: { heading: "Reset password", sub: "We'll email you a reset link" },
  };

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'poppins', serif; }
        .font-body { font-family: 'poppins', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-20px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(139,120,255,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(139,120,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(139,120,255,0); }
        }

        .anim-card   { animation: cardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-fade-1 { opacity:0; animation: fadeUp 0.4s ease 0.2s forwards; }
        .anim-fade-2 { opacity:0; animation: fadeUp 0.4s ease 0.3s forwards; }
        .anim-fade-3 { opacity:0; animation: fadeUp 0.4s ease 0.38s forwards; }
        .anim-fade-4 { opacity:0; animation: fadeUp 0.4s ease 0.44s forwards; }
        .anim-fade-5 { opacity:0; animation: fadeUp 0.4s ease 0.5s forwards; }
        .anim-fade-6 { opacity:0; animation: fadeUp 0.4s ease 0.56s forwards; }
        .anim-fade-7 { opacity:0; animation: fadeUp 0.4s ease 0.62s forwards; }
        .anim-fade-8 { opacity:0; animation: fadeUp 0.4s ease 0.68s forwards; }

        .orb-float { animation: orbFloat 7s ease-in-out infinite; }
        .orb-float-slow { animation: orbFloat 10s ease-in-out infinite reverse; }
        .spinner { animation: spin 0.65s linear infinite; }
        .logo-pulse { animation: pulseRing 2s ease-out infinite; }

        .oauth-btn:hover { transform: translateY(-1px); }
        .oauth-btn:active { transform: translateY(0px); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); }
        .submit-btn:active { transform: translateY(0px); }
        .input-field:focus { box-shadow: 0 0 0 3px rgba(139,120,255,0.2); }
        .input-field.error:focus { box-shadow: 0 0 0 3px rgba(255,107,107,0.15); }
      `}</style>

      {/* Root */}
      <div className="font-body min-h-screen w-full bg-[#07070f] flex items-center justify-center p-5 relative overflow-hidden">

        {/* Ambient orbs */}
        <div className="orb-float pointer-events-none absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[#8b78ff]/10 blur-[100px]" />
        <div className="orb-float-slow pointer-events-none absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-[#4f8fff]/8 blur-[90px]" />
        <div className="orb-float pointer-events-none absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full bg-[#ff6496]/6 blur-[70px]" style={{ animationDelay: "3s" }} />

        {/* Card */}
        <div
          className="anim-card relative w-full max-w-[420px] bg-[#0d0d1a] border border-white/[0.07] rounded-[24px] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.55),inset_0_0_0_0.5px_rgba(255,255,255,0.04)]"
          style={{ opacity: 0 }}
        >
          {/* Inner top glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b78ff]/40 to-transparent rounded-t-[24px]" />

          {/* Brand */}
          <div className="anim-fade-1 flex flex-col items-center mb-8">
            <div className="logo-pulse mb-3 w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#8b78ff] to-[#5094ff] flex items-center justify-center shadow-[0_8px_28px_rgba(139,120,255,0.4)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.95)" />
                <path d="M2 17l10 5 10-5" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 12l10 5 10-5" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="font-poppins text-[26px] text-white tracking-[-0.5px] leading-none">EventsMap</h1>
            <p className="mt-1 text-[12.5px] text-white/35 font-light">Discover what's happening around you</p>
          </div>

          {/* Form shell — keyed so animations retrigger on mode change */}
          <div key={animKey}>

            {/* Mode heading */}
            <div className="anim-fade-2 mb-6">
              <h2 className="font-poppins text-[20px] text-white/90 tracking-[-0.3px]">{titles[mode].heading}</h2>
              <p className="text-[12.5px] text-white/35 mt-0.5 font-light">{titles[mode].sub}</p>
            </div>

            {/* Global error */}
            {globalError && (
              <div className="anim-fade-2 mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[12.5px]">
                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {globalError}
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="anim-fade-2 mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[12.5px]">
                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                {successMsg}
              </div>
            )}

            {/* OAuth — hide on forgot */}
            {mode !== "forgot" && (
              <>
                <div className="anim-fade-3 grid grid-cols-2 gap-2.5 mb-5">
                  {[
                    { id: "google", icon: <GoogleIcon />, label: "Google" },
                    { id: "github", icon: <GithubIcon />, label: "GitHub" },
                  ].map(({ id, icon, label }) => (
                    <button
                      key={id}
                      onClick={() => handleOAuth(id as "google" | "github")}
                      disabled={isLoading}
                      className="oauth-btn flex items-center justify-center gap-2 h-[42px] rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/65 text-[13px] font-medium cursor-pointer transition-all duration-150 hover:bg-white/[0.06] hover:border-white/[0.14] hover:text-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>

                <div className="anim-fade-3 flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-white/[0.07]" />
                  <span className="text-[11px] text-white/25 font-light whitespace-nowrap">or continue with email</span>
                  <div className="flex-1 h-px bg-white/[0.07]" />
                </div>
              </>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Display name — signup only */}
              {mode === "signup" && (
                <div className="anim-fade-4 flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.4px]">Full name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.displayName}
                    onChange={update("displayName")}
                    className={`input-field w-full h-[44px] px-3.5 rounded-xl bg-white/[0.04] border text-[13.5px] text-white placeholder-white/[0.18] outline-none transition-all duration-150 ${fieldError("displayName") ? "border-red-400/50 error" : "border-white/[0.08] focus:border-[#8b78ff]/50"}`}
                  />
                  {fieldError("displayName") && (
                    <p className="text-[11.5px] text-red-400 flex items-center gap-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                      {fieldError("displayName")}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className={`${mode === "signup" ? "anim-fade-5" : "anim-fade-4"} flex flex-col gap-1.5`}>
                <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.4px]">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={update("email")}
                  className={`input-field w-full h-[44px] px-3.5 rounded-xl bg-white/[0.04] border text-[13.5px] text-white placeholder-white/[0.18] outline-none transition-all duration-150 ${fieldError("email") ? "border-red-400/50 error" : "border-white/[0.08] focus:border-[#8b78ff]/50"}`}
                />
                {fieldError("email") && (
                  <p className="text-[11.5px] text-red-400 flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    {fieldError("email")}
                  </p>
                )}
              </div>

              {/* Password */}
              {mode !== "forgot" && (
                <div className={`${mode === "signup" ? "anim-fade-6" : "anim-fade-5"} flex flex-col gap-1.5`}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.4px]">Password</label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-[11.5px] text-white/30 hover:text-[#a394ff] transition-colors duration-150 cursor-pointer bg-transparent border-none"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={update("password")}
                      className={`input-field w-full h-[44px] pl-3.5 pr-10 rounded-xl bg-white/[0.04] border text-[13.5px] text-white placeholder-white/[0.18] outline-none transition-all duration-150 ${fieldError("password") ? "border-red-400/50 error" : "border-white/[0.08] focus:border-[#8b78ff]/50"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-150 bg-transparent border-none cursor-pointer p-0.5"
                    >
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                  {fieldError("password") && (
                    <p className="text-[11.5px] text-red-400 flex items-center gap-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                      {fieldError("password")}
                    </p>
                  )}
                </div>
              )}

              {/* Confirm password — signup only */}
              {mode === "signup" && (
                <div className="anim-fade-7 flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-white/40 uppercase tracking-[0.4px]">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={update("confirmPassword")}
                      className={`input-field w-full h-[44px] pl-3.5 pr-10 rounded-xl bg-white/[0.04] border text-[13.5px] text-white placeholder-white/[0.18] outline-none transition-all duration-150 ${fieldError("confirmPassword") ? "border-red-400/50 error" : "border-white/[0.08] focus:border-[#8b78ff]/50"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-150 bg-transparent border-none cursor-pointer p-0.5"
                    >
                      <EyeIcon show={showConfirm} />
                    </button>
                  </div>
                  {fieldError("confirmPassword") && (
                    <p className="text-[11.5px] text-red-400 flex items-center gap-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                      {fieldError("confirmPassword")}
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`submit-btn ${mode === "signup" ? "anim-fade-8" : "anim-fade-6"} mt-1 h-[46px] rounded-[13px] border-none bg-gradient-to-r from-[#8b78ff] to-[#6b8fff] text-white text-[14px] font-semibold cursor-pointer transition-all duration-150 shadow-[0_6px_24px_rgba(139,120,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading && (
                    <span className="spinner w-4 h-4 rounded-full border-2 border-white/30 border-t-white inline-block" />
                  )}
                  {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                </span>
                {/* Sheen overlay */}
                <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              </button>
            </form>

            {/* Mode switcher */}
            <div className={`${mode === "signup" ? "anim-fade-8" : "anim-fade-7"} mt-6 text-center text-[13px] text-white/30`}>
              {mode === "signin" && (
                <>Don't have an account?<button onClick={() => setMode("signup")} className="ml-1 text-[#a394ff] font-medium hover:text-white transition-colors duration-150 bg-transparent border-none cursor-pointer font-body text-[13px]">Sign up</button></>
              )}
              {mode === "signup" && (
                <>Already have an account?<button onClick={() => setMode("signin")} className="ml-1 text-[#a394ff] font-medium hover:text-white transition-colors duration-150 bg-transparent border-none cursor-pointer font-body text-[13px]">Sign in</button></>
              )}
              {mode === "forgot" && (
                <><button onClick={() => setMode("signin")} className="text-[#a394ff] font-medium hover:text-white transition-colors duration-150 bg-transparent border-none cursor-pointer font-body text-[13px]">← Back to sign in</button></>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;