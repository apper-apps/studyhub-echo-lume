import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import TodaySchedule from "@/components/organisms/TodaySchedule";
import UpcomingDeadlines from "@/components/organisms/UpcomingDeadlines";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { scheduleService } from "@/services/api/scheduleService";
import { gradeService } from "@/services/api/gradeService";

const Dashboard = () => {
  const [data, setData] = useState({
    courses: [],
    assignments: [],
    schedule: [],
    grades: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesData, assignmentsData, scheduleData, gradesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        scheduleService.getAll(),
        gradeService.getAll()
      ]);

      // Calculate stats
      const today = new Date();
      const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const pendingAssignments = assignmentsData.filter(a => !a.completed).length;
      const dueThisWeek = assignmentsData.filter(a => {
        const dueDate = new Date(a.dueDate);
        return !a.completed && dueDate >= today && dueDate <= oneWeekFromNow;
      }).length;

      // Calculate GPA
      let totalGradePoints = 0;
      let totalCredits = 0;
      
      coursesData.forEach(course => {
        const courseGrades = gradesData.filter(g => g.courseId === course.Id);
        if (courseGrades.length > 0) {
          const avgScore = courseGrades.reduce((sum, grade) => {
            const gradeAvg = grade.scores?.length > 0 
              ? grade.scores.reduce((s, score) => s + score, 0) / grade.scores.length 
              : grade.average || 85;
            return sum + (gradeAvg * (grade.weight / 100));
          }, 0);
          
          // Convert percentage to GPA (4.0 scale)
          const gpaPoints = Math.max(0, Math.min(4.0, (avgScore - 50) * 4 / 50));
          totalGradePoints += gpaPoints * course.credits;
          totalCredits += course.credits;
        }
      });

      const currentGPA = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";

      const stats = {
        activeCourses: coursesData.length,
        pendingAssignments,
        dueThisWeek,
        currentGPA
      };

      setData({
        courses: coursesData,
        assignments: assignmentsData,
        schedule: scheduleData,
        grades: gradesData,
        stats
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} className="p-6" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardStats stats={data.stats} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TodaySchedule 
              schedule={data.schedule}
              assignments={data.assignments}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UpcomingDeadlines 
              assignments={data.assignments}
              courses={data.courses}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;