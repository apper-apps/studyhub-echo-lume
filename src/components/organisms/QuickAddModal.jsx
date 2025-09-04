import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const QuickAddModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium"
  });
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter an assignment title");
      return;
    }
    
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }
    
    if (!formData.dueDate) {
      toast.error("Please set a due date");
      return;
    }

    setIsSubmitting(true);

    try {
      const newAssignment = {
        title: formData.title.trim(),
        courseId: parseInt(formData.courseId),
        dueDate: formData.dueDate,
        priority: formData.priority,
        description: "",
        completed: false,
        grade: null,
        category: "assignment"
      };

      await assignmentService.create(newAssignment);
      
      toast.success("Assignment added successfully!");
      
      // Reset form
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium"
      });
      
      onClose();
    } catch (error) {
      toast.error("Failed to add assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
                    <ApperIcon name="Plus" size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-semibold text-gray-900">
                      Quick Add Assignment
                    </h2>
                    <p className="text-sm text-gray-600">Add a new assignment quickly</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField
                  label="Assignment Title"
                  type="input"
                  placeholder="Enter assignment title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />

                <FormField
                  label="Course"
                  type="select"
                  value={formData.courseId}
                  onChange={(e) => handleInputChange("courseId", e.target.value)}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.Id} value={course.Id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />

                <FormField
                  label="Priority"
                  type="select"
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </FormField>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                    ) : (
                      <ApperIcon name="Plus" size={18} className="mr-2" />
                    )}
                    Add Assignment
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;