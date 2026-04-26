import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFiles, deleteFile, downloadFile, previewFile, getDevices, revokeDevice, grantDevice, uploadFile } from "../services/api";
import { getDeviceFingerprint } from "../utils/deviceFingerprint";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";

interface FileData {
  _id: string;
  originalName: string;
  size: number;
  createdAt: string;
  mimeType: string;
}

interface Device {
  deviceHash: string;
  deviceName?: string;
  revoked: boolean;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"files" | "devices">("files");
  const [files, setFiles] = useState<FileData[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentHash, setCurrentHash] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });


  // Load Files
  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await getFiles();
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to load files", err);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // Load Devices
  const loadDevices = async () => {
    try {
      setLoading(true);
      const res = await getDevices();
      setDevices(res.data);
      const { hash } = await getDeviceFingerprint();
      setCurrentHash(hash);
    } catch (err) {
      console.error("Failed to load devices", err);
      toast.error("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "files") loadFiles();
    else loadDevices();
  }, [activeTab]);

  const openConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ title, message, onConfirm });
    setIsModalOpen(true);
  };

  // File Handlers
  const handleDelete = (id: string) => {
    openConfirmation("Delete File", "Are you sure you want to delete this file? This action cannot be undone.", async () => {
      try {
        await deleteFile(id);
        setFiles(files.filter((f) => f._id !== id));
        toast.success("File deleted successfully");
      } catch (err) {
        toast.error("Failed to delete file");
      }
    });
  };

  const handleDownload = async (file: FileData) => {
    try {
      await downloadFile(file._id, file.originalName);
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download file");
    }
  };

  const handlePreview = async (file: FileData) => {
    try {
      await previewFile(file._id);
    } catch (err) {
      toast.error("Failed to preview file");
    }
  };

  const handleShare = (file: FileData) => {
      const link = `${window.location.origin}/download/${file._id}`; 
      navigator.clipboard.writeText(link);
      toast.info("Link copied to clipboard!");
  };

  // Device Handlers
  const handleRevoke = (deviceHash: string) => {
    openConfirmation("Revoke Access", "Are you sure you want to revoke access for this device? It will be logged out immediately.", async () => {
      try {
        await revokeDevice(deviceHash);
        toast.success("Device revoked successfully");
        loadDevices();
      } catch (err) {
        toast.error("Failed to revoke device");
      }
    });
  };

  const handleGrant = (deviceHash: string) => {
    openConfirmation("Grant Access", "Are you sure you want to grant access to this device again?", async () => {
      try {
        await grantDevice(deviceHash);
        toast.success("Device access granted successfully");
        loadDevices();
      } catch (err) {
        toast.error("Failed to grant device access");
      }
    });
  };

  // Upload Handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await uploadFile(formData);
      toast.success("Upload successful!");
      if (activeTab === "files") loadFiles();
    } catch (err) {
      toast.error("Upload failed.");
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen relative bg-[#0B0F19] text-white font-sans overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <main className="relative z-10 md:ml-64 pl-6 pr-6 md:pl-10 md:pr-14 py-10 pt-20 md:pt-10 w-auto max-w-[1400px]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="text-center md:text-left">
             <h2 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              File Vault
            </h2>
            <p className="text-[#A1A1A9] text-sm mt-1">Manage your secure files and devices</p>
          </div>
         
          <div className="mt-4 md:mt-0 flex space-x-3">
             {/* Upload Button */}
             <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-200 border border-blue-500/50 flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                {uploading ? "Uploading..." : "Upload File"}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-white/[0.08] mb-6">
          <button
            onClick={() => setActiveTab("files")}
            className={`pb-3 text-sm font-medium transition-all duration-300 relative ${
              activeTab === "files"
                ? "text-white"
                : "text-[#A1A1A9] hover:text-white"
            }`}
          >
            My Files
            {activeTab === "files" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("devices")}
            className={`pb-3 text-sm font-medium transition-all duration-300 relative ${
              activeTab === "devices"
                ? "text-white"
                : "text-[#A1A1A9] hover:text-white"
            }`}
          >
            My Devices
            {activeTab === "devices" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t-full"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] relative animate-in fade-in duration-500">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map((skeleton) => (
                <div key={skeleton} className="h-32 rounded-xl bg-white/5 border border-white/[0.05] animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === "files" ? (
            <div>
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-white/5 border-dashed rounded-xl bg-[#111622]/50 animate-in zoom-in-95 duration-300">
                        <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#A1A1A9]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium text-white mb-1">No files uploaded</h3>
                        <p className="text-[#A1A1A9] text-xs">Upload your first file securely to get started.</p>
                    </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <div key={file._id} className="group bg-[#111622] rounded-xl p-4 border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200">
                        <div className="flex items-start justify-between">
                            <div className="bg-white/5 p-2 rounded-lg border border-white/[0.05] text-[#A1A1A9] group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-white truncate" title={file.originalName}>{file.originalName}</h4>
                            <p className="text-xs text-[#A1A1A9] mt-1">{formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <div className="flex bg-black/20 rounded-lg p-1 border border-white/[0.05] w-full justify-between lg:justify-start lg:gap-1">
                                <button 
                                    onClick={() => handlePreview(file)} 
                                    title="Preview File"
                                    className="p-1.5 text-[#A1A1A9] hover:text-white hover:bg-white/10 rounded-md transition-all flex-1 flex justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDownload(file)} 
                                    title="Download File"
                                    className="p-1.5 text-[#A1A1A9] hover:text-white hover:bg-white/10 rounded-md transition-all flex-1 flex justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleShare(file)} 
                                    title="Share Link"
                                    className="p-1.5 text-[#A1A1A9] hover:text-white hover:bg-white/10 rounded-md transition-all flex-1 flex justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(file._id)} 
                                    title="Delete File"
                                    className="p-1.5 text-[#A1A1A9] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all flex-1 flex justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ) : (
            <div>
                {devices.length === 0 ? (
                     <div className="text-center py-20 border border-white/5 border-dashed rounded-xl bg-[#111622]/50">
                         <p className="text-[#A1A1A9] text-sm">No active devices found (Strange!).</p>
                     </div>
                ) : (
                    <div className="space-y-3">
                        {devices.map((device, index) => {
                          const isCurrent = device.deviceHash === currentHash;
                          return (
                            <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                isCurrent 
                                ? "bg-blue-500/5 border-blue-500/20"
                                : "bg-[#111622] border-white/[0.08]"
                            }`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2.5 rounded-lg border flex-shrink-0 ${isCurrent ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-[#A1A1A9] border-white/[0.05]"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white text-sm">
                                                {device.deviceName || "Unknown Device"} 
                                            </p>
                                            {isCurrent && <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md font-semibold tracking-wide">Current</span>}
                                        </div>
                                        <p className="text-[11px] text-[#A1A1A9] font-mono mt-1 break-all">{device.deviceHash}</p>
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                                device.revoked 
                                                ? "bg-red-500/10 text-red-500 border-red-500/20" 
                                                : "bg-[#111622] text-[#A1A1A9] border-white/10"
                                            }`}>
                                                {device.revoked ? "Revoked" : "Active"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {device.revoked ? (
                                      <button
                                        onClick={() => handleGrant(device.deviceHash)}
                                        className="text-xs font-medium bg-white text-black hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ml-4"
                                      >
                                        Grant Access
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
                          );
                        })}
                    </div>
                )}
            </div>
          )}
        </div>
      </main>
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        confirmLabel="Proceed"
      />
    </div>
  );
};

export default Dashboard;
