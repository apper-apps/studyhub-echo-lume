import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);

      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load assignments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (assignmentId) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const updatedAssignment = { ...assignment, completed: !assignment.completed };
      
      await assignmentService.update(assignmentId, updatedAssignment);
      
      setAssignments(prev => 
        prev.map(a => a.Id === assignmentId ? updatedAssignment : a)
      );
      
      toast.success(
        updatedAssignment.completed 
          ? "Assignment marked as complete!" 
          : "Assignment marked as incomplete"
      );
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const getCourse = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && assignment.completed) ||
                         (statusFilter === "pending" && !assignment.completed);
    
    const matchesCourse = courseFilter === "all" || assignment.courseId.toString() === courseFilter;
    
    const matchesPriority = priorityFilter === "all" || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesPriority;
  });

  // Sort by due date (upcoming first) and then by priority
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    // Completed items go to bottom
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // Then sort by due date
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    
    return dateA - dateB;
  });

  const getStats = () => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.completed).length;
    const pending = total - completed;
    const overdue = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return !a.completed && dueDate < new Date();
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getStats();

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} className="p-6" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-accent-600 via-orange-600 to-accent-600 bg-clip-text text-transparent">
                Assignments
              </h1>
              <p className="text-gray-600">Track and manage all your assignments and deadlines.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
              <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
              <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
              <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
              <p className="text-2xl font-bold text-error-600">{stats.overdue}</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <SearchBar
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex flex-wrap gap-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Select>
              
              <Select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-40"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.Id} value={course.Id.toString()}>
                    {course.code}
                  </option>
                ))}
              </Select>
              
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {sortedAssignments.length === 0 ? (
            <Empty
              title="No assignments found"
              description={
                searchTerm || statusFilter !== "all" || courseFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first assignment to track your progress"
              }
              icon="CheckSquare"
              actionLabel="Add Assignment"
            />
          ) : (
            <div className="space-y-4">
              {sortedAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.02 }}
                >
                  <AssignmentItem
                    assignment={assignment}
                    course={getCourse(assignment.courseId)}
                    onToggle={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Assignments;