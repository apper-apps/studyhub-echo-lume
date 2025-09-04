import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { scheduleService } from "@/services/api/scheduleService";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("month");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [assignmentsData, coursesData, scheduleData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll(),
        scheduleService.getAll()
      ]);

      setAssignments(assignmentsData);
      setCourses(coursesData);
      setSchedule(scheduleData);
    } catch (err) {
      setError("Failed to load calendar data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
const events = [];
    
    // Add assignments due on this date
    const dueTasks = assignments.filter(assignment => 
      isSameDay(new Date(assignment.due_date_c || assignment.dueDate), date)
    );
    
    dueTasks.forEach(task => {
      const course = courses.find(c => c.Id === (task.course_id_c || task.courseId));
      events.push({
        id: `assignment-${task.Id}`,
        type: "assignment",
        title: task.title_c || task.title,
        color: course?.color_c || course?.color || "#6B7280",
        course: course?.code_c || course?.code || "Unknown",
        completed: task.completed_c === "true" || task.completed,
        priority: task.priority_c || task.priority
      });
    });

    // Add scheduled classes for this day
    const dayName = format(date, "EEEE").toLowerCase();
    const classesToday = schedule.filter(item => 
      (item.day_of_week_c || item.dayOfWeek)?.toLowerCase() === dayName
    );
    
    classesToday.forEach(classItem => {
      const course = courses.find(c => c.Id === (classItem.course_id_c || classItem.courseId));
      events.push({
        id: `class-${classItem.Id}`,
        type: "class",
        title: course?.Name || course?.name || classItem.course_name_c || classItem.courseName || "Class",
        color: course?.color_c || course?.color || classItem.color_c || classItem.color || "#6B7280",
        time: `${classItem.start_time_c || classItem.startTime} - ${classItem.end_time_c || classItem.endTime}`,
        room: classItem.room_c || classItem.room
      });
    });

    return events;
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const isToday = (date) => isSameDay(date, new Date());
  const isSelected = (date) => selectedDate && isSameDay(date, selectedDate);

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} className="p-6" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Calendar" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Calendar
              </h1>
              <p className="text-gray-600">View your classes and assignment deadlines.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
              disabled
            >
              Week
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-xl font-display">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {calendarDays.map(date => {
                    const events = getEventsForDate(date);
                    const hasEvents = events.length > 0;
                    
                    return (
                      <div
                        key={date.toString()}
                        className={`min-h-[100px] p-2 border-r border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                          !isSameMonth(date, currentDate) ? "text-gray-300 bg-gray-50" : ""
                        } ${
                          isToday(date) ? "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200" : ""
                        } ${
                          isSelected(date) ? "bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200" : ""
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday(date) ? "text-primary-700" : 
                          isSelected(date) ? "text-accent-700" : 
                          "text-gray-900"
                        }`}>
                          {format(date, "d")}
                        </div>
                        
                        <div className="space-y-1">
                          {events.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className="text-xs px-2 py-1 rounded truncate"
                              style={{ 
                                backgroundColor: event.color + "20",
                                color: event.color,
                                border: `1px solid ${event.color}40`
                              }}
                            >
                              <div className="flex items-center space-x-1">
                                <ApperIcon 
                                  name={event.type === "assignment" ? "CheckSquare" : "BookOpen"} 
                                  size={10}
                                />
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          ))}
                          {events.length > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{events.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Details Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Info" size={18} />
                  <span>
                    {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select a date"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {getSelectedDateEvents().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No events for this day</p>
                      </div>
                    ) : (
                      getSelectedDateEvents().map(event => (
                        <div key={event.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: event.color }}
                            >
                              <ApperIcon 
                                name={event.type === "assignment" ? "CheckSquare" : "BookOpen"} 
                                size={16} 
                                className="text-white"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {event.title}
                              </h4>
                              
                              {event.course && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {event.course}
                                </p>
                              )}
                              
                              {event.time && (
                                <p className="text-sm text-gray-600 mt-1 flex items-center">
                                  <ApperIcon name="Clock" size={14} className="mr-1" />
                                  {event.time}
                                </p>
                              )}
                              
{event.room && (
                                <p className="text-sm text-gray-600 mt-1 flex items-center">
                                  <ApperIcon name="MapPin" size={14} className="mr-1" />
                                  {event.room}
                                </p>
                              )}
                              
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge 
                                  variant={event.type === "assignment" ? "warning" : "default"}
                                  className="text-xs"
                                >
                                  {event.type === "assignment" ? "Assignment" : "Class"}
                                </Badge>
                                
                                {event.priority && (
                                  <Badge 
                                    variant={
                                      event.priority === "high" ? "error" :
                                      event.priority === "medium" ? "warning" : "success"
                                    }
                                    className="text-xs"
                                  >
                                    {event.priority}
                                  </Badge>
                                )}
                                
                                {event.completed && (
                                  <Badge variant="success" className="text-xs">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click on a date to see events</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckSquare" size={14} className="text-accent-600" />
                  <span className="text-sm text-gray-600">Assignments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="BookOpen" size={14} className="text-primary-600" />
                  <span className="text-sm text-gray-600">Classes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-200 rounded border border-primary-300"></div>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;