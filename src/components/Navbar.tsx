import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Setup2FAModal from "./Setup2FAModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-6 left-6 z-[60] p-3 bg-slate-900 border border-white/10 rounded-xl text-white shadow-2xl"
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <nav className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-3xl bg-slate-950/80 border-r border-white/5 shadow-2xl flex flex-col justify-between py-10 px-8 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="flex items-center cursor-pointer mb-12 pl-1" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 mr-3 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
               </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent transform hover:scale-105 transition-all duration-300 tracking-tight">
              CloudSafe
            </h1>
          </div>

          <div className="space-y-4">
             <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2">Security</div>
             <button
              onClick={() => setIs2FAModalOpen(true)}
              className="w-full text-left px-5 py-3.5 text-[15px] font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all focus:outline-none flex items-center justify-start gap-4 transform hover:-translate-y-0.5 shadow-md shadow-cyan-500/5 group"
            >
              <div className="bg-cyan-500/20 p-2 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <span className="tracking-wide">Setup 2-Factor</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 text-[15px] font-bold text-red-100 bg-red-600/20 hover:bg-red-600/30 rounded-xl transition-all outline-none border border-red-500/30 hover:border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.15)] group"
            >
              Log Out
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-red-300 group-hover:text-red-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
        </div>
      </nav>

      <Setup2FAModal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} />
    </>
  );
};

export default Navbar;
