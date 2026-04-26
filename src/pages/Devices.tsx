import { useEffect, useState } from "react";
import { getDevices, revokeDevice, grantDevice } from "../services/api";
import { getDeviceFingerprint } from "../utils/deviceFingerprint";

interface Device {
  deviceHash: string;
  deviceName?: string;
  revoked: boolean;
}

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentHash, setCurrentHash] = useState<string>("");

  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
      const { hash } = await getDeviceFingerprint();
      setCurrentHash(hash);
    } catch (err) {
      console.error("Failed to load devices", err);
    }
  };

  const handleRevoke = async (deviceHash: string) => {
    if(!confirm("Are you sure you want to revoke access?")) return;
    try {
      await revokeDevice(deviceHash);
      loadDevices();
    } catch (err) {
      alert("Failed to revoke device");
    }
  };

  const handleGrant = async (deviceHash: string) => {
    if(!confirm("Are you sure you want to grant access?")) return;
    try {
      await grantDevice(deviceHash);
      loadDevices();
    } catch (err) {
      alert("Failed to grant device");
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0B0F19] text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="relative z-10 bg-[#111622] p-8 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95 duration-500">
        <h2 className="text-2xl font-semibold mb-6 text-center tracking-tight">
          Device Management
        </h2>

        {devices.length === 0 && (
          <p className="text-center text-[#A1A1A9] py-8 border border-white/5 border-dashed rounded-xl">
            No active devices found.
          </p>
        )}

        <div className="space-y-3">
            {devices.map((device, index) => {
              const isCurrent = device.deviceHash === currentHash;
              return (
                <div
                  key={index}
                  className={`border border-white/[0.08] p-4 rounded-xl flex justify-between items-center transition-all ${isCurrent ? "bg-blue-500/5 border-blue-500/20" : "bg-white/5"}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-white text-sm">
                           {device.deviceName || "Unknown Device"}
                        </p>
                        {isCurrent && <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md font-semibold tracking-wide">Current</span>}
                    </div>
                    <p className="text-[11px] font-mono break-all text-[#A1A1A9] mt-1">
                      {device.deviceHash}
                    </p>
                    <div className="mt-2 text-xs">
                       <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            device.revoked 
                            ? "bg-red-500/10 text-red-500 border-red-500/20" 
                            : "bg-[#111622] text-[#A1A1A9] border-white/10"
                        }`}>
                            {device.revoked ? "Revoked" : "Active"}
                        </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {device.revoked ? (
                      <button
                        onClick={() => handleGrant(device.deviceHash)}
                        className="text-xs font-medium bg-white text-black hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ml-4"
                      >
                        Grant
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevoke(device.deviceHash)}
                        className="text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-md transition-colors border border-red-500/10 whitespace-nowrap ml-4"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Devices;
