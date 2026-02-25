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
    <div className="min-h-screen flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded shadow w-[500px]">
        <h2 className="text-xl font-bold mb-4 text-center">
          Device Management
        </h2>

        {devices.length === 0 && (
          <p className="text-center text-gray-500">
            No registered devices
          </p>
        )}

        {devices.map((device, index) => {
          const isCurrent = device.deviceHash === currentHash;
          return (
            <div
              key={index}
              className={`border p-3 rounded mb-2 flex justify-between items-center ${isCurrent ? "bg-blue-50 border-blue-200" : ""}`}
            >
              <div>
                <p className="font-semibold text-sm">
                   {device.deviceName || "Unknown Device"}
                   {isCurrent && <span className="text-blue-600 font-bold ml-2">(Current)</span>}
                </p>
                <p className="text-xs font-mono truncate w-48 text-gray-500">
                  {device.deviceHash}
                </p>
                <p
                  className={`text-xs ${
                    device.revoked ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {device.revoked ? "Revoked" : "Active"}
                </p>
              </div>

              <div className="flex space-x-2">
                {device.revoked ? (
                  <button
                    onClick={() => handleGrant(device.deviceHash)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Grant
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevoke(device.deviceHash)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
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
  );
};

export default Devices;
