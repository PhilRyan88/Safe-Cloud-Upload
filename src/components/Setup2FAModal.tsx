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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111622] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-white">Setup 2-Factor Auth</h2>
          <button onClick={onClose} className="text-[#A1A1A9] hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4 text-center">
            <p className="text-[#A1A1A9] text-sm leading-relaxed">
              Scan this QR code with your authenticator app (e.g. Google Authenticator, Authy).
            </p>
            
            <div className="flex justify-center my-6">
              <div className="bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] inline-block border border-white/20">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 rounded" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center animate-pulse bg-slate-100 rounded-xl">
                    <span className="text-[#A1A1A9] text-sm">Loading code...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-[#A1A1A9] text-xs px-2 break-all bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg">
              Can't scan? Use this setup key:<br/>
              <span className="font-mono text-white tracking-widest font-medium select-all text-sm mt-2 flex justify-center">{secret}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-200 border border-blue-500/50"
            >
              I've scanned the code
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
             <p className="text-[#A1A1A9] text-sm mb-4 text-center">
              Enter the 6-digit code from your authenticator app to verify setup.
            </p>
            
            <div>
              <input
                type="text"
                className="w-full px-4 py-4 bg-[#0B0F19] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder-[#52525B] transition-all font-mono tracking-[0.4em] text-center text-3xl"
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
                className="flex-1 hover:bg-white/5 border border-white/10 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-200 border border-blue-500/50"
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
