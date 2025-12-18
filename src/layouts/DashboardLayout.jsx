import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
