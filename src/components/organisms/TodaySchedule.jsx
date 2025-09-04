import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TodaySchedule = ({ schedule, assignments }) => {
  const today = new Date();
  const dayName = format(today, "EEEE").toLowerCase();

  // Filter today's classes
  const todayClasses = schedule.filter(item => 
    item.dayOfWeek?.toLowerCase() === dayName
  );

  // Filter today's due assignments
  const todayAssignments = assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate.toDateString() === today.toDateString() && !assignment.completed;
  });

  // Combine and sort by time
  const allItems = [
    ...todayClasses.map(cls => ({
      ...cls,
      type: "class",
      time: cls.startTime,
      title: cls.courseName || cls.title
    })),
    ...todayAssignments.map(assignment => ({
      ...assignment,
      type: "assignment",
      time: "23:59", // Due end of day
      title: assignment.title
    }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  if (allItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={20} />
            <span>Today's Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Calendar" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No schedule for today</h3>
            <p className="text-gray-600">Enjoy your free day!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Calendar" size={20} />
          <span>Today's Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allItems.map((item, index) => (
          <div 
            key={`${item.type}-${item.Id || index}`} 
            className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg shadow-md"
                 style={{ backgroundColor: item.color || "#6B7280" }}>
              <ApperIcon 
                name={item.type === "class" ? "BookOpen" : "CheckSquare"} 
                size={20} 
                className="text-white" 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <ApperIcon name="Clock" size={14} />
                  <span>
                    {item.type === "class" 
                      ? `${item.startTime} - ${item.endTime}` 
                      : "Due today"
                    }
                  </span>
                </div>
                
                {item.room && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <ApperIcon name="MapPin" size={14} />
                    <span>{item.room}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Badge 
                variant={item.type === "class" ? "default" : "warning"}
                className="text-xs"
              >
                {item.type === "class" ? "Class" : "Due"}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;