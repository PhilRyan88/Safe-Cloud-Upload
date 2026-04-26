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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-[#111622]/80 backdrop-blur-2xl p-10 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-[420px] mx-4 animate-in fade-in zoom-in-95 duration-500"
      >
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mx-auto flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 tracking-tight text-white">Welcome back</h2>
          <p className="text-[#A1A1A9] text-sm">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          {!requires2FA ? (
            <>
              <div>
                <label className="block text-sm font-medium text-[#A1A1A9] mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-[#52525B] transition-all hover:bg-[#151A27]"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-[#A1A1A9] mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-[#52525B] transition-all hover:bg-[#151A27]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <label className="block text-sm font-medium text-[#A1A1A9] mb-4 text-center">6-Digit Authenticator Code</label>
              <input
                type="text"
                className="w-full px-4 py-4 bg-[#0B0F19] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-[#52525B] transition-all font-mono tracking-[0.3em] text-center text-2xl"
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
          className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-200 border border-blue-500/50"
        >
          {requires2FA ? "Verify Code" : "Sign In"}
        </button>

        <p className="mt-8 text-center text-sm text-[#A1A1A9]">
          Don't have an account?{" "}
          <a href="/register" className="text-white hover:text-blue-400 font-medium transition-colors">
            Create account
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
