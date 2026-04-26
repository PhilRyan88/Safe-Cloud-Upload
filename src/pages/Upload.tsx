import { useState,type FormEvent } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/files/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("File encrypted and uploaded");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <form
        onSubmit={handleUpload}
        className="relative z-10 bg-[#111622] p-8 rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-500"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center tracking-tight">
          Secure File Upload
        </h2>

        <div className="mb-6">
            <input
              type="file"
              className="w-full text-sm text-[#A1A1A9] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-white/10 file:bg-white/5 file:text-white file:font-medium hover:file:bg-white/10 cursor-pointer transition-all"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all duration-200 border border-blue-500/50"
        >
          Encrypt & Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
