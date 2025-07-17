import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Members from "@/components/pages/Members";
import AddMember from "@/components/pages/AddMember";
import EditMember from "@/components/pages/EditMember";
import Attendance from "@/components/pages/Attendance";
import Reports from "@/components/pages/Reports";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/members") return "Members";
    if (path === "/members/new") return "Add Member";
    if (path.includes("/members/") && path.includes("/edit")) return "Edit Member";
    if (path === "/attendance") return "Attendance";
    if (path === "/reports") return "Reports";
    return "FaithRoster";
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64">
        <Header
          onMenuClick={handleMenuClick}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          title={getPageTitle()}
        />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/new" element={<AddMember />} />
            <Route path="/members/:id/edit" element={<EditMember />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
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