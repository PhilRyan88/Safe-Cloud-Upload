import { useState, useEffect } from "react";
import { setup2FA, verifySetup2FA } from "../services/api";
import { toast } from "react-toastify";

import { createPortal } from "react-dom";

interface Setup2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Setup2FAModal = ({ isOpen, onClose }: Setup2FAModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (isOpen) {
      loadSetup();
    } else {
      setStep(1);
      setToken("");
    }
  }, [isOpen]);

  const loadSetup = async () => {
    try {
      const res = await setup2FA();
      setQrCodeUrl(res.data.qrCodeUrl);
      setSecret(res.data.secret);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate 2FA setup");
      onClose();
    }
  };

  const handleVerify = async () => {
    if (token.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    
    try {
      await verifySetup2FA(token);
      toast.success("2-Factor Authentication enabled successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid code. Please try again.");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Setup 2-Factor Auth</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4 text-center">
            <p className="text-slate-400 text-sm">
              Scan this QR code with your Microsoft Authenticator app (or Google Authenticator, Authy, etc).
            </p>
            
            <div className="flex justify-center my-6">
              <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] inline-block border border-white/20">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center animate-pulse bg-slate-100 rounded-xl">
                    <span className="text-slate-400 text-sm">Loading QR Code...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-slate-500 text-xs break-all px-4">
              Can't scan? Use this setup key:<br/>
              <span className="font-mono text-cyan-400 tracking-wider font-semibold select-all text-sm mt-1 inline-block">{secret}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5"
            >
              I've scanned the code
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
             <p className="text-slate-400 text-sm mb-4 text-center">
              Enter the 6-digit code from your authenticator app to verify setup.
            </p>
            
            <div>
              <input
                type="text"
                className="w-full px-4 py-4 bg-slate-950/50 border border-slate-700/50 shadow-inner rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-slate-700 transition-all font-mono tracking-[0.4em] text-center text-3xl"
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength={6}
                autoFocus
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Verify & Enable
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Setup2FAModal;
