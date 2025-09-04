import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CircularProgress from "@/components/atoms/CircularProgress";
import TimerSettings from "@/components/organisms/TimerSettings";
import { timerService } from "@/services/api/timerService";

const StudyTimer = () => {
  const [session, setSession] = useState(timerService.getCurrentSession());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Subscribe to timer updates
    const unsubscribe = timerService.addListener((newSession) => {
      setSession(newSession);
    });

    // Handle session completion notifications
    const originalHandleComplete = timerService.handleSessionComplete;
    timerService.handleSessionComplete = function() {
      const result = originalHandleComplete.call(this);
      if (result) {
        showCompletionNotification(result);
      }
      return result;
    };

    return () => {
      unsubscribe();
      // Cleanup on unmount
      if (timerService.destroy) {
        timerService.destroy();
      }
    };
  }, []);

  const showCompletionNotification = (completionInfo) => {
    const { completedType, nextType, sessionCount } = completionInfo;
    
    if (completedType === 'work') {
      toast.success(`🎉 Focus session completed! Sessions: ${sessionCount}`, {
        autoClose: 5000
      });
      
      if (nextType === 'longBreak') {
        toast.info("🌟 Time for a long break! Great work!", {
          autoClose: 5000
        });
      } else {
        toast.info("☕ Time for a short break!", {
          autoClose: 5000
        });
      }
    } else {
      toast.success("✨ Break completed! Ready to focus?", {
        autoClose: 5000
      });
    }
  };

  const handleStart = () => {
    timerService.startTimer();
    toast.success("Timer started! Stay focused! 🎯");
  };

  const handlePause = () => {
    timerService.pauseTimer();
    toast.info("Timer paused. Take a moment to recharge.");
  };

  const handleStop = () => {
    timerService.stopTimer();
    toast.info("Timer stopped. Session reset.");
  };

  const getSessionColor = () => {
    switch (session.type) {
      case 'work':
        return 'primary';
      case 'shortBreak':
        return 'success';
      case 'longBreak':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getSessionIcon = () => {
    switch (session.type) {
      case 'work':
        return 'Focus';
      case 'shortBreak':
        return 'Coffee';
      case 'longBreak':
        return 'Palmtree';
      default:
        return 'Clock';
    }
  };

  const getSessionEmoji = () => {
    switch (session.type) {
      case 'work':
        return '🎯';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌟';
      default:
        return '⏱️';
    }
  };

  const progress = timerService.getProgress();
  const timeDisplay = timerService.formatTime(session.timeRemaining);
  const sessionLabel = timerService.getSessionTypeLabel();
  const isRunning = session.isRunning && !session.isPaused;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
            Study Timer
          </h1>
          <p className="text-gray-600 text-lg">
            Stay focused with the Pomodoro Technique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                  <span className="text-2xl">{getSessionEmoji()}</span>
                  <span>{sessionLabel}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Progress Ring */}
                <div className="flex justify-center">
                  <CircularProgress
                    progress={progress}
                    size={280}
                    strokeWidth={12}
                    color={getSessionColor()}
                    className="drop-shadow-xl"
                  >
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl font-bold font-mono text-gray-900 mb-2">
                        {timeDisplay}
                      </div>
                      <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                        {session.isPaused ? 'Paused' : isRunning ? 'Running' : 'Ready'}
                      </div>
                    </div>
                  </CircularProgress>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!isRunning ? (
                    <Button
                      onClick={handleStart}
                      size="lg"
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-8"
                    >
                      <ApperIcon 
                        name={session.isPaused ? "Play" : "Play"} 
                        size={20} 
                        className="mr-2" 
                      />
                      {session.isPaused ? "Resume" : "Start"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      size="lg"
                      variant="outline"
                      className="px-8"
                    >
                      <ApperIcon name="Pause" size={20} className="mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleStop}
                    size="lg"
                    variant="outline"
                    className="px-8"
                    disabled={!session.isRunning && !session.isPaused}
                  >
                    <ApperIcon name="Square" size={20} className="mr-2" />
                    Stop
                  </Button>
                  
                  <Button
                    onClick={() => setShowSettings(true)}
                    size="lg"
                    variant="ghost"
                  >
                    <ApperIcon name="Settings" size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <ApperIcon name="BarChart3" size={20} />
                  <span>Session Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Sessions</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {session.sessionCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Type</span>
                  <span className="text-lg font-semibold text-gray-900 capitalize">
                    {session.type === 'shortBreak' ? 'Short Break' : 
                     session.type === 'longBreak' ? 'Long Break' : 
                     'Focus Session'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {Math.round(progress)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <ApperIcon name="Zap" size={20} />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ApperIcon name="Settings" size={16} className="mr-2" />
                  Timer Settings
                </Button>
                <Button
                  onClick={handleStop}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!session.isRunning && !session.isPaused}
                >
                  <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                  Reset Timer
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <ApperIcon name="Lightbulb" size={20} />
                  <span>Pomodoro Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-primary-500 mt-0.5">•</span>
                    <span>Focus completely during work sessions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary-500 mt-0.5">•</span>
                    <span>Take proper breaks to recharge</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary-500 mt-0.5">•</span>
                    <span>Eliminate distractions during focus time</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary-500 mt-0.5">•</span>
                    <span>Track your completed sessions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Settings Modal */}
        <TimerSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
};

export default StudyTimer;