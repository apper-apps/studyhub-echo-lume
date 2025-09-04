import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const CourseModal = ({ isOpen, onClose, onCourseCreated }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Tags: "",
    code_c: "",
    instructor_c: "",
    room_c: "",
    color_c: "blue",
    semester_c: "",
    credits_c: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim()) {
      toast.error("Please enter a course name");
      return;
    }
    
    if (!formData.code_c.trim()) {
      toast.error("Please enter a course code");
      return;
    }
    
    if (!formData.instructor_c.trim()) {
      toast.error("Please enter an instructor name");
      return;
    }
    
    if (!formData.semester_c.trim()) {
      toast.error("Please enter a semester");
      return;
    }
    
    if (!formData.credits_c || isNaN(formData.credits_c) || formData.credits_c <= 0) {
      toast.error("Please enter valid credits (number greater than 0)");
      return;
    }

    setIsSubmitting(true);

    try {
      const newCourse = {
        Name: formData.Name.trim(),
        Tags: formData.Tags.trim(),
        code_c: formData.code_c.trim(),
        instructor_c: formData.instructor_c.trim(),
        room_c: formData.room_c.trim(),
        color_c: formData.color_c,
        semester_c: formData.semester_c.trim(),
        credits_c: parseInt(formData.credits_c)
      };
      
      await courseService.create(newCourse);
      
      toast.success("Course created successfully!");
      
      // Reset form
      setFormData({
        Name: "",
        Tags: "",
        code_c: "",
        instructor_c: "",
        room_c: "",
        color_c: "blue",
        semester_c: "",
        credits_c: ""
      });
      
      if (onCourseCreated) {
        onCourseCreated();
      }
      
      onClose();
    } catch (error) {
      toast.error("Failed to create course");
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

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Pink" },
    { value: "teal", label: "Teal" },
    { value: "red", label: "Red" },
    { value: "indigo", label: "Indigo" },
    { value: "yellow", label: "Yellow" },
    { value: "cyan", label: "Cyan" }
  ];

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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                    <ApperIcon name="BookOpen" size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Create New Course</h2>
                    <p className="text-sm text-gray-500">Add a new course to your academic schedule</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Course Name"
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                    placeholder="Enter course name"
                    required
                  />

                  <FormField
                    label="Course Code"
                    type="text"
                    value={formData.code_c}
                    onChange={(e) => handleInputChange("code_c", e.target.value)}
                    placeholder="e.g. CS101, MATH200"
                    required
                  />

                  <FormField
                    label="Instructor"
                    type="text"
                    value={formData.instructor_c}
                    onChange={(e) => handleInputChange("instructor_c", e.target.value)}
                    placeholder="Enter instructor name"
                    required
                  />

                  <FormField
                    label="Room"
                    type="text"
                    value={formData.room_c}
                    onChange={(e) => handleInputChange("room_c", e.target.value)}
                    placeholder="e.g. Room 101, Lab A"
                  />

                  <FormField
                    label="Semester"
                    type="text"
                    value={formData.semester_c}
                    onChange={(e) => handleInputChange("semester_c", e.target.value)}
                    placeholder="e.g. Fall 2024, Spring 2025"
                    required
                  />

                  <FormField
                    label="Credits"
                    type="number"
                    value={formData.credits_c}
                    onChange={(e) => handleInputChange("credits_c", e.target.value)}
                    placeholder="Enter credit hours"
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <FormField
                  label="Tags"
                  type="text"
                  value={formData.Tags}
                  onChange={(e) => handleInputChange("Tags", e.target.value)}
                  placeholder="Enter tags separated by commas (e.g. math, required, advanced)"
                />

                <FormField
                  label="Color"
                  type="select"
                  value={formData.color_c}
                  onChange={(e) => handleInputChange("color_c", e.target.value)}
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                    ) : (
                      <ApperIcon name="BookOpen" size={18} className="mr-2" />
                    )}
                    Create Course
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

export default CourseModal;