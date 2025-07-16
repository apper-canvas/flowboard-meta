import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import ProjectBoard from "@/components/pages/ProjectBoard";
import AllProjects from "@/components/pages/AllProjects";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard onToggleSidebar={toggleSidebar} />} 
            />
            <Route 
              path="/projects" 
              element={<AllProjects onToggleSidebar={toggleSidebar} />} 
            />
            <Route 
              path="/projects/:projectId" 
              element={<ProjectBoard onToggleSidebar={toggleSidebar} />} 
            />
          </Routes>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;