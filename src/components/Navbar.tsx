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
        className="md:hidden fixed top-6 left-6 z-[60] p-3 bg-[#111622] border border-white/10 rounded-xl text-white shadow-2xl"
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-[#0B0F19]/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <nav className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-3xl bg-[#0B0F19]/90 border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col justify-between py-10 px-8 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="flex items-center cursor-pointer mb-12 pl-1 group" onClick={() => navigate("/dashboard")}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                  <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-3.397 2.97l-4.22-.603C4.242 11.002 5.349 10 6.64 10H10.5v-6.202Z" clipRule="evenodd" />
                  <path d="M12 2.5a2.25 2.25 0 0 1 2.25 2.25v2.5a2.25 2.25 0 0 1-2.25 2.25h-2.5a2.25 2.25 0 0 1-2.25-2.25v-2.5A2.25 2.25 0 0 1 9.5 2.5H12Z" />
               </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              CloudSafe
            </h1>
          </div>

          <div className="space-y-4">
             <div className="px-3 py-1 text-[11px] font-semibold text-[#A1A1A9] uppercase tracking-wider mb-2">Security</div>
             <button
              onClick={() => setIs2FAModalOpen(true)}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 group"
            >
              <div className="border border-white/10 p-1.5 rounded-lg group-hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#A1A1A9] group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <span>Setup 2-Factor</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#A1A1A9] hover:text-white hover:bg-white/5 rounded-xl transition-all group"
            >
               <div className="border border-transparent p-1.5 rounded-lg group-hover:bg-white/10 group-hover:border-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#A1A1A9] group-hover:text-white transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
              </div>
              <span>Log Out</span>
            </button>
        </div>
      </nav>

      <Setup2FAModal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} />
    </>
  );
};

export default Navbar;
