import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const UpcomingDeadlines = ({ assignments, courses }) => {
  const today = new Date();
  
  // Filter and sort upcoming assignments
const upcomingAssignments = assignments
    .filter(assignment => {
      const dueDate = new Date(assignment.due_date_c || assignment.dueDate);
      const daysDiff = differenceInDays(dueDate, today);
      const completed = assignment.completed_c === "true" || assignment.completed;
      return !completed && daysDiff >= 0 && daysDiff <= 7;
    })
    .sort((a, b) => new Date(a.due_date_c || a.dueDate) - new Date(b.due_date_c || b.dueDate))
    .slice(0, 5); // Show only next 5

  const getCourse = (courseId) => {
return courses.find(course => course.Id === courseId);
  };

  const getDaysUntilDue = (dueDate) => {
    const days = differenceInDays(new Date(dueDate), today);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  if (upcomingAssignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Clock" size={20} />
            <span>Upcoming Deadlines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={32} className="text-success-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No upcoming deadlines this week.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={20} />
          <span>Upcoming Deadlines</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingAssignments.map((assignment) => {
const course = getCourse(assignment.course_id_c || assignment.courseId);
          const daysUntil = getDaysUntilDue(assignment.dueDate);
          
          return (
            <div 
              key={assignment.Id} 
              className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200"
>
              <div 
                className="w-3 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: course?.color_c || course?.color || "#6B7280" }}
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{assignment.title_c || assignment.title}</h4>
                <div className="flex items-center space-x-3 mt-1">
<span className="text-sm text-gray-600">
                    {course?.code_c || course?.code || "Unknown Course"}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <ApperIcon name="Calendar" size={14} />
                    <span>{format(new Date(assignment.due_date_c || assignment.dueDate), "MMM dd")}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right space-y-1">
<Badge 
                  variant={getPriorityColor(assignment.priority_c || assignment.priority)}
                  className="text-xs"
                >
                  {assignment.priority}
                </Badge>
                <p className={`text-xs font-medium ${
                  daysUntil === "Today" ? "text-error-600" : 
                  daysUntil === "Tomorrow" ? "text-warning-600" : 
                  "text-gray-600"
                }`}>
                  {daysUntil}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;