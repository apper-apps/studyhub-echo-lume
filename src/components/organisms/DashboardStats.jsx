import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DashboardStats = ({ stats }) => {
  const statItems = [
    {
      title: "Active Courses",
      value: stats.activeCourses || 0,
      icon: "BookOpen",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "Pending Assignments",
      value: stats.pendingAssignments || 0,
      icon: "CheckSquare",
      color: "from-accent-500 to-accent-600",
      bgColor: "from-accent-50 to-accent-100"
    },
    {
      title: "Due This Week",
      value: stats.dueThisWeek || 0,
      icon: "Calendar",
      color: "from-warning-500 to-warning-600",
      bgColor: "from-warning-50 to-warning-100"
    },
    {
      title: "Current GPA",
      value: stats.currentGPA || "0.00",
      icon: "Award",
      color: "from-success-500 to-success-600",
      bgColor: "from-success-50 to-success-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={item.title} className="transform hover:scale-[1.02] transition-all duration-200 hover:shadow-xl overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${item.color}`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-gray-600">
              {item.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.bgColor} flex items-center justify-center shadow-md`}>
              <ApperIcon name={item.icon} size={20} className={`bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-display font-bold text-gray-900">
              {item.title === "Current GPA" ? item.value : item.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {item.title === "Current GPA" ? "Out of 4.00" : "Items"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;