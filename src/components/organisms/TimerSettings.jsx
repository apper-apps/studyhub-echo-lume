import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { timerService } from "@/services/api/timerService";

const TimerSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(timerService.getSettings());

  useEffect(() => {
    if (isOpen) {
      setSettings(timerService.getSettings());
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDurationChange = (field, minutes) => {
    const seconds = Math.max(1, Math.min(120, minutes)) * 60; // 1-120 minutes
    setSettings(prev => ({
      ...prev,
      [field]: seconds
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (settings.workDuration < 60 || settings.workDuration > 120 * 60) {
      toast.error("Work duration must be between 1 and 120 minutes");
      return;
    }
    
    if (settings.shortBreakDuration < 60 || settings.shortBreakDuration > 60 * 60) {
      toast.error("Short break must be between 1 and 60 minutes");
      return;
    }
    
    if (settings.longBreakDuration < 60 || settings.longBreakDuration > 120 * 60) {
      toast.error("Long break must be between 1 and 120 minutes");
      return;
    }

    timerService.updateSettings(settings);
    toast.success("Timer settings updated successfully!");
    onClose();
  };

  const resetToDefaults = () => {
    const defaults = {
      workDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartSessions: false,
      soundEnabled: true
    };
    setSettings(defaults);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                    <ApperIcon name="Settings" size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-semibold text-gray-900">
                      Timer Settings
                    </h2>
                    <p className="text-sm text-gray-600">Customize your Pomodoro experience</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Duration Settings */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 flex items-center space-x-2">
                    <ApperIcon name="Clock" size={18} />
                    <span>Duration Settings</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      label="Work Duration (minutes)"
                      type="number"
                      min="1"
                      max="120"
                      value={Math.round(settings.workDuration / 60)}
                      onChange={(e) => handleDurationChange("workDuration", parseInt(e.target.value) || 1)}
                    />
                    
                    <FormField
                      label="Short Break Duration (minutes)"
                      type="number"
                      min="1"
                      max="60"
                      value={Math.round(settings.shortBreakDuration / 60)}
                      onChange={(e) => handleDurationChange("shortBreakDuration", parseInt(e.target.value) || 1)}
                    />
                    
                    <FormField
                      label="Long Break Duration (minutes)"
                      type="number"
                      min="1"
                      max="120"
                      value={Math.round(settings.longBreakDuration / 60)}
                      onChange={(e) => handleDurationChange("longBreakDuration", parseInt(e.target.value) || 1)}
                    />
                    
                    <FormField
                      label="Sessions Before Long Break"
                      type="number"
                      min="2"
                      max="10"
                      value={settings.sessionsBeforeLongBreak}
                      onChange={(e) => handleInputChange("sessionsBeforeLongBreak", parseInt(e.target.value) || 4)}
                    />
                  </div>
                </div>

                {/* Auto-start Settings */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 flex items-center space-x-2">
                    <ApperIcon name="Play" size={18} />
                    <span>Auto-start Settings</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartBreaks}
                        onChange={(e) => handleInputChange("autoStartBreaks", e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Auto-start breaks</div>
                        <div className="text-xs text-gray-600">Automatically start break sessions</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartSessions}
                        onChange={(e) => handleInputChange("autoStartSessions", e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Auto-start work sessions</div>
                        <div className="text-xs text-gray-600">Automatically start work sessions after breaks</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => handleInputChange("soundEnabled", e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Sound notifications</div>
                        <div className="text-xs text-gray-600">Play sound when sessions complete</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetToDefaults}
                    className="flex-1"
                  >
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  >
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Settings
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TimerSettings;