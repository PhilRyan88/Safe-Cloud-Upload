import { useState, type FormEvent } from "react";
import { registerUser } from "../services/api";
import { getDeviceFingerprint } from "../utils/deviceFingerprint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { hash, name } = await getDeviceFingerprint();

      await registerUser({
        email,
        password,
        deviceHash: hash,
        deviceName: name,
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-[#111622]/80 backdrop-blur-2xl p-10 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-[420px] mx-4 animate-in fade-in zoom-in-95 duration-500"
      >
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mx-auto flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 tracking-tight text-white">Create Account</h2>
          <p className="text-[#A1A1A9] text-sm">Join us to securely lock your files</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#A1A1A9] mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white placeholder-[#52525B] transition-all hover:bg-[#151A27]"
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
              className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white placeholder-[#52525B] transition-all hover:bg-[#151A27]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all duration-200 border border-purple-500/50"
        >
          Register
        </button>
        
        <p className="mt-8 text-center text-sm text-[#A1A1A9]">
           Already have an account?{" "}
          <a href="/login" className="text-white hover:text-purple-400 font-medium transition-colors">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
