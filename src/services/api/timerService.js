class TimerService {
  constructor() {
    this.defaultSettings = {
      workDuration: 25 * 60, // 25 minutes in seconds
      shortBreakDuration: 5 * 60, // 5 minutes in seconds
      longBreakDuration: 15 * 60, // 15 minutes in seconds
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartSessions: false,
      soundEnabled: true
    };
    
    this.currentSession = {
      type: 'work', // 'work', 'shortBreak', 'longBreak'
      timeRemaining: this.defaultSettings.workDuration,
      totalTime: this.defaultSettings.workDuration,
      sessionCount: 0,
      isRunning: false,
      isPaused: false
    };
    
    this.settings = this.loadSettings();
    this.listeners = new Set();
    this.intervalId = null;
  }

  // Settings management
  getSettings() {
    return { ...this.settings };
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    
    // If timer is not running, update current session with new durations
    if (!this.currentSession.isRunning) {
      this.resetCurrentSession();
    }
    
    this.notifyListeners();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('studyTimer_settings');
      return saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : { ...this.defaultSettings };
    } catch (error) {
      return { ...this.defaultSettings };
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('studyTimer_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save timer settings:', error);
    }
  }

  // Session management
  getCurrentSession() {
    return { ...this.currentSession };
  }

  startTimer() {
    if (this.currentSession.isPaused) {
      this.currentSession.isPaused = false;
    } else if (!this.currentSession.isRunning) {
      this.currentSession.isRunning = true;
    }

    this.intervalId = setInterval(() => {
      this.currentSession.timeRemaining--;
      
      if (this.currentSession.timeRemaining <= 0) {
        this.handleSessionComplete();
      }
      
      this.notifyListeners();
    }, 1000);
    
    this.notifyListeners();
  }

  pauseTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentSession.isPaused = true;
    this.notifyListeners();
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.resetCurrentSession();
    this.notifyListeners();
  }

  resetCurrentSession() {
    const duration = this.getDurationForCurrentType();
    this.currentSession = {
      ...this.currentSession,
      timeRemaining: duration,
      totalTime: duration,
      isRunning: false,
      isPaused: false
    };
  }

  handleSessionComplete() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    const wasWorkSession = this.currentSession.type === 'work';
    
    if (wasWorkSession) {
      this.currentSession.sessionCount++;
    }

    // Determine next session type
    let nextType;
    if (wasWorkSession) {
      if (this.currentSession.sessionCount % this.settings.sessionsBeforeLongBreak === 0) {
        nextType = 'longBreak';
      } else {
        nextType = 'shortBreak';
      }
    } else {
      nextType = 'work';
    }

    this.currentSession.type = nextType;
    const nextDuration = this.getDurationForCurrentType();
    this.currentSession.timeRemaining = nextDuration;
    this.currentSession.totalTime = nextDuration;
    this.currentSession.isRunning = false;
    this.currentSession.isPaused = false;

    // Auto-start next session if enabled
    const shouldAutoStart = (wasWorkSession && this.settings.autoStartBreaks) || 
                           (!wasWorkSession && this.settings.autoStartSessions);
    
    if (shouldAutoStart) {
      this.startTimer();
    }

    this.notifyListeners();
    
    // Return session completion info for notifications
    return {
      completedType: wasWorkSession ? 'work' : (this.currentSession.sessionCount % this.settings.sessionsBeforeLongBreak === 1 ? 'longBreak' : 'shortBreak'),
      nextType,
      sessionCount: this.currentSession.sessionCount
    };
  }

  getDurationForCurrentType() {
    switch (this.currentSession.type) {
      case 'work':
        return this.settings.workDuration;
      case 'shortBreak':
        return this.settings.shortBreakDuration;
      case 'longBreak':
        return this.settings.longBreakDuration;
      default:
        return this.settings.workDuration;
    }
  }

  // Utility methods
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getProgress() {
    if (this.currentSession.totalTime === 0) return 0;
    return ((this.currentSession.totalTime - this.currentSession.timeRemaining) / this.currentSession.totalTime) * 100;
  }

  getSessionTypeLabel() {
    switch (this.currentSession.type) {
      case 'work':
        return 'Focus Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Session';
    }
  }

  // Event listeners
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getCurrentSession()));
  }

  // Cleanup
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.listeners.clear();
  }
}

export const timerService = new TimerService();