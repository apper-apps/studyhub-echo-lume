import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CourseCard = ({ course, onClick }) => {
  const getNextClass = () => {
    if (!course.schedule || course.schedule.length === 0) return null;
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    // Find next class
    for (let i = 0; i < 7; i++) {
      const checkDay = (dayOfWeek + i) % 7;
      const dayName = days[checkDay];
      const classToday = course.schedule.find(s => s.dayOfWeek.toLowerCase() === dayName);
      
      if (classToday) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        return {
          ...classToday,
          date: nextDate
        };
      }
    }
    return null;
  };

  const nextClass = getNextClass();
  
  return (
    <Card 
      className="cursor-pointer transform hover:scale-[1.02] transition-all duration-200 hover:shadow-xl border-l-4"
      style={{ borderLeftColor: course.color }}
      onClick={() => onClick && onClick(course)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{course.name}</CardTitle>
            <p className="text-sm text-gray-600 font-medium">{course.code}</p>
          </div>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: course.color }}
          >
            <ApperIcon name="BookOpen" size={24} className="text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="User" size={16} className="mr-2" />
            <span>{course.instructor}</span>
          </div>
          
          {course.room && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="MapPin" size={16} className="mr-2" />
              <span>{course.room}</span>
            </div>
          )}
          
          {nextClass && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Clock" size={16} className="mr-2" />
              <span>
                {nextClass.date.toDateString() === new Date().toDateString() ? "Today" : format(nextClass.date, "EEE")} {nextClass.startTime}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {course.credits} credits
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.semester}
            </Badge>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Grade</p>
            <p className="text-sm font-semibold text-gray-900">A-</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;