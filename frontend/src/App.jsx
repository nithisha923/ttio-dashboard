import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubmitInvention from "./pages/SubmitInvention";
import FacultyPortal from "./pages/FacultyPortal";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-invention" element={<SubmitInvention />} />
        <Route path="/faculty-portal" element={<FacultyPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
