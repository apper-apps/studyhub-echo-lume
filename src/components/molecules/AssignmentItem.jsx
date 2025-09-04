import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import { differenceInDays, format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const AssignmentItem = ({ assignment, course, onToggle, onEdit }) => {
  const dueDate = new Date(assignment.due_date_c || assignment.dueDate);
  const today = new Date();
  const daysUntilDue = differenceInDays(dueDate, today);
  
const getPriorityColor = () => {
    switch ((assignment.priority_c || assignment.priority)?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

const getDueDateColor = () => {
    const completed = assignment.completed_c === "true" || assignment.completed;
    if (completed) return "text-gray-500";
    if (daysUntilDue < 0) return "text-error-600";
    if (daysUntilDue === 0) return "text-warning-600";
    if (daysUntilDue <= 2) return "text-accent-600";
    return "text-gray-600";
  };

  const getDueDateText = () => {
    const completed = assignment.completed_c === "true" || assignment.completed;
    if (completed) return "Completed";
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return "Due today";
    if (daysUntilDue === 1) return "Due tomorrow";
    return `Due in ${daysUntilDue} days`;
  };

  return (
<Card
    className={`transition-all duration-200 hover:shadow-lg ${assignment.completed_c === "true" || assignment.completed ? "opacity-75" : ""}`}>
    <CardContent className="p-4">
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
<input
                    type="checkbox"
                    checked={Boolean(assignment.completed_c === "true" || assignment.completed)}
                    onChange={() => onToggle(assignment.Id)}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer" />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h3
                            className={`font-semibold text-gray-900 ${assignment.completed_c === "true" || assignment.completed ? "line-through" : ""}`}>
                            {assignment.title_c || assignment.title}
                        </h3>
                        {(assignment.description_c || assignment.description) && <p className="text-sm text-gray-600 mt-1">{assignment.description_c || assignment.description}</p>}
                    </div>
                    {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(assignment)}>
                        <ApperIcon name="Edit2" size={16} />
                    </Button>}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: course?.color_c || course?.color || "#6B7280"
                            }} />
                        <span className="text-gray-600">{course?.Name || course?.name || "Unknown Course"}</span>
                    </div>
                </div>
                <Badge variant={getPriorityColor()} className="text-xs">
                    {assignment.priority_c || assignment.priority}
                </Badge>
                {(assignment.category_c || assignment.category) && <Badge variant="outline" className="text-xs">
                    {assignment.category_c || assignment.category}
                </Badge>}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {format(dueDate, "MMM dd, yyyy")}
                    </span>
                </div>
                <span className={`text-xs font-medium ${getDueDateColor()}`}>
                    {getDueDateText()}
                </span>
            </div>
            {(assignment.grade_c || assignment.grade) !== null && (assignment.grade_c || assignment.grade) !== undefined && <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                <ApperIcon name="Award" size={14} className="text-success-500" />
                <span className="text-sm font-medium text-success-600">Grade: {assignment.grade_c || assignment.grade}%
                                    </span>
            </div>}
        </div>
    </CardContent>
</Card>
  );
};

export default AssignmentItem;