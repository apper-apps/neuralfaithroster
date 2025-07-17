import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Members", href: "/members", icon: "Users" },
    { name: "Add Member", href: "/members/new", icon: "UserPlus" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "FileText" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gradient">FaithRoster</h1>
        <p className="text-sm text-gray-600 mt-1">Membership Management</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            <ApperIcon name={item.icon} size={18} className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Church" size={16} className="mr-2" />
          <span>Grace Community Church</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn("lg:hidden fixed inset-0 z-50", isOpen ? "block" : "hidden")}>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 left-0 w-64 z-50"
        >
          {sidebarContent}
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;