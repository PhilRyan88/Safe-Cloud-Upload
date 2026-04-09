import { useState,type FormEvent } from "react";
import { loginUser, verifyLogin2FA } from "../services/api";
import { getDeviceFingerprint } from "../utils/deviceFingerprint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [otpToken, setOtpToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { hash, name } = await getDeviceFingerprint();

      if (requires2FA) {
        const res = await verifyLogin2FA({
          userId,
          token: otpToken,
          deviceHash: hash,
          deviceName: name,
        });
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successful!");
        navigate("/dashboard");
        return;
      }

      const res = await loginUser({
        email,
        password,
        deviceHash: hash,
        deviceName: name,
      });

      if (res.data.requires2FA) {
        setRequires2FA(true);
        setUserId(res.data.userId);
        toast.info("Please enter your 2FA code.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-slate-300 text-sm">Sign in to continue to your dashboard</p>
        </div>

        <div className="space-y-4">
          {!requires2FA ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-500 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <label className="block text-sm font-medium text-slate-300 mb-1 ml-1 text-center">6-Digit Authenticator Code</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-500 transition-all font-mono tracking-widest text-center text-xl"
                placeholder="000000"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                required
                maxLength={6}
                autoFocus
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {requires2FA ? "Verify Code" : "Sign In"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
            Create account
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
