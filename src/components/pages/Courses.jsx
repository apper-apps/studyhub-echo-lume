import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.code_c || course.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.instructor_c || course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = semesterFilter === "all" || (course.semester_c || course.semester) === semesterFilter;
    
    return matchesSearch && matchesSemester;
  });

const uniqueSemesters = [...new Set(courses.map(course => course.semester_c || course.semester).filter(Boolean))];

  const handleCourseClick = (course) => {
    // Handle course click - could navigate to course detail page
    console.log("Course clicked:", course);
  };

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadCourses} className="p-6" />;

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                My Courses
              </h1>
              <p className="text-gray-600">Manage and track all your enrolled courses.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchBar
              placeholder="Search courses, codes, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <Select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="sm:w-48"
            >
              <option value="all">All Semesters</option>
              {uniqueSemesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </Select>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filteredCourses.length === 0 ? (
            <Empty
              title={searchTerm || semesterFilter !== "all" ? "No courses found" : "No courses yet"}
              description={
                searchTerm || semesterFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first course to track your academic progress"
              }
              icon="BookOpen"
              actionLabel="Add Course"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    onClick={handleCourseClick}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        {filteredCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="font-display font-semibold text-gray-900 mb-4">Course Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="text-2xl font-bold text-blue-600">{filteredCourses.length}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <p className="text-2xl font-bold text-green-600">
{filteredCourses.reduce((sum, course) => sum + (course.credits_c || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Credits</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                <p className="text-2xl font-bold text-purple-600">{uniqueSemesters.length}</p>
                <p className="text-sm text-gray-600">Semesters</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;