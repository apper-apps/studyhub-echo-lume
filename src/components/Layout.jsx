import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuickAddModal from "@/components/organisms/QuickAddModal";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "Home" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "CheckSquare" },
    { path: "/calendar", label: "Calendar", icon: "Calendar" },
    { path: "/grades", label: "Grades", icon: "BarChart3" },
  ];

  const DesktopSidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-40">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="GraduationCap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              StudyHub
            </h1>
            <p className="text-xs text-gray-500 font-medium">Academic Organizer</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <Button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Quick Add
        </Button>
      </div>
    </div>
  );

  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <ApperIcon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      StudyHub
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">Academic Organizer</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-6 left-4 right-4">
              <Button
                onClick={() => {
                  setIsQuickAddOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold"
              >
                <ApperIcon name="Plus" size={18} className="mr-2" />
                Quick Add
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={18} className="text-white" />
              </div>
              <h1 className="text-lg font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                StudyHub
              </h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsQuickAddOpen(true)}
          >
            <ApperIcon name="Plus" size={20} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};

export default Layout;