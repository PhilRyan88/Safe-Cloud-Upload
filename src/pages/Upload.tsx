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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Secure File Upload
        </h2>

        <input
          type="file"
          className="mb-4 bg-black"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Encrypt & Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
