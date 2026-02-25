import axios from "axios";


const API = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});


export interface AuthPayload {
  email: string;
  password: string;
  deviceHash: string;
  deviceName?: string;
}


export const registerUser = (data: AuthPayload) =>
  API.post("/auth/register", data);

export const loginUser = (data: AuthPayload) =>
  API.post("/auth/login", data);


export const getDevices = () =>
  API.get("/auth/devices");

export const revokeDevice = (deviceHash: string) =>
  API.post("/auth/revoke-device", {
    deviceHash,
  });

export const grantDevice = (deviceHash: string) =>
  API.post("/auth/grant-device", {
    deviceHash,
  });

/* ======================
   FILE MANAGEMENT APIS
====================== */
export const uploadFile = (formData: FormData) =>
  API.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getFiles = () => API.get("/files");

export const deleteFile = (id: string) => API.delete(`/files/${id}`);

export const downloadFile = async (id: string, fileName: string) => {
  const response = await API.get(`/files/download/${id}`, {
    responseType: "blob",
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const previewFile = async (id: string) => {
  const response = await API.get(`/files/download/${id}`, {
    responseType: "blob",
  });
  
  const file = new Blob([response.data], { type: response.headers["content-type"] });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL, "_blank");
};

export default API;
