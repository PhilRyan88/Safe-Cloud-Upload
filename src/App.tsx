import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Upload from "./pages/Upload";
import Devices from "./pages/Devices";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      /><Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Upload />
    </ProtectedRoute>
  }
/>
<Route
  path="/devices"
  element={
    <ProtectedRoute>
      <Devices />
    </ProtectedRoute>
  }
/>
    </Routes>
    </>
  );
}

export default App;
