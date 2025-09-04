import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import ReactApexChart from "react-apexcharts";
import { gradeService } from "@/services/api/gradeService";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [gradesData, coursesData, assignmentsData] = await Promise.all([
        gradeService.getAll(),
        courseService.getAll(),
        assignmentService.getAll()
      ]);

      setGrades(gradesData);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load grades data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const calculateCourseGrade = (courseId) => {
    const courseGrades = grades.filter(g => (g.course_id_c || g.courseId) === courseId);
    if (courseGrades.length === 0) return null;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    courseGrades.forEach(grade => {
      const scores = grade.scores_c || grade.scores;
      const avgScore = Array.isArray(scores) && scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : (grade.average_c || grade.average || 85);
      
      const weight = grade.weight_c || grade.weight || 0;
      totalWeightedScore += avgScore * (weight / 100);
      totalWeight += weight / 100;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : null;
  };

  const calculateGPA = (percentage) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    if (percentage >= 65) return 0.7;
    return 0.0;
  };

  const getGradeLevel = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  };

  const getOverallGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
const courseGrade = calculateCourseGrade(course.Id);
      if (courseGrade !== null) {
        const gpaPoints = calculateGPA(courseGrade);
        const credits = course.credits_c || course.credits || 0;
        totalGradePoints += gpaPoints * credits;
        totalCredits += credits;
      }
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";
  };

  const getGradeDistributionChart = () => {
    const distribution = { "A": 0, "B": 0, "C": 0, "D": 0, "F": 0 };
    
    courses.forEach(course => {
      const grade = calculateCourseGrade(course.Id);
      if (grade !== null) {
        const level = getGradeLevel(grade);
        const category = level.charAt(0);
        distribution[category] = (distribution[category] || 0) + 1;
      }
    });

    return {
      series: Object.values(distribution),
      options: {
        chart: { type: "donut", height: 300 },
        labels: ["A", "B", "C", "D", "F"],
        colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"],
        legend: { position: "bottom" },
        dataLabels: { enabled: true },
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                name: { show: true },
                value: { show: true },
                total: {
                  show: true,
                  label: "Total Courses",
                  formatter: () => courses.length
                }
              }
            }
          }
        }
      }
    };
  };

  const getProgressChart = (courseId) => {
const courseAssignments = assignments
      .filter(a => {
        const assignmentCourseId = a.course_id_c || a.courseId;
        const assignmentGrade = a.grade_c || a.grade;
        return assignmentCourseId === courseId && assignmentGrade !== null;
      })
      .sort((a, b) => new Date(a.due_date_c || a.dueDate) - new Date(b.due_date_c || b.dueDate));

    if (courseAssignments.length === 0) return null;

    return {
      series: [{
        name: "Grade",
        data: courseAssignments.map(a => a.grade_c || a.grade)
      }],
      options: {
        chart: { type: "line", height: 200, sparkline: { enabled: true } },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#4F46E5"],
        xaxis: {
          categories: courseAssignments.map((_, index) => `Assignment ${index + 1}`)
        },
        yaxis: { min: 0, max: 100 },
        tooltip: {
          x: { show: true },
          y: { formatter: (val) => `${val}%` }
        }
      }
    };
  };

  const filteredCourses = selectedCourse === "all" 
    ? courses 
    : courses.filter(course => course.Id.toString() === selectedCourse);

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} className="p-6" />;

  const chartData = getGradeDistributionChart();

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
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="BarChart3" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-success-600 via-emerald-600 to-success-600 bg-clip-text text-transparent">
                Grades
              </h1>
              <p className="text-gray-600">Track your academic performance and GPA.</p>
            </div>
          </div>

          {/* GPA Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="transform hover:scale-[1.02] transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Award" size={32} className="text-success-600" />
                </div>
                <h3 className="text-3xl font-bold text-success-600 mb-1">{getOverallGPA()}</h3>
                <p className="text-sm text-gray-600">Overall GPA</p>
                <p className="text-xs text-gray-500 mt-1">Out of 4.00</p>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-[1.02] transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="BookOpen" size={32} className="text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 mb-1">{courses.length}</h3>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-xs text-gray-500 mt-1">This semester</p>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-[1.02] transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="TrendingUp" size={32} className="text-purple-600" />
                </div>
<h3 className="text-3xl font-bold text-purple-600 mb-1">
                  {courses.reduce((sum, course) => sum + (course.credits_c || course.credits || 0), 0)}
                </h3>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-xs text-gray-500 mt-1">This semester</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-64"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
<option key={course.Id} value={course.Id.toString()}>
                  {course.Name || course.name} ({course.code_c || course.code})
                </option>
              ))}
            </Select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Grades */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {filteredCourses.length === 0 ? (
              <Empty
                title="No courses found"
                description="Start by enrolling in courses to track your grades"
                icon="BookOpen"
                actionLabel="Add Course"
              />
            ) : (
              filteredCourses.map((course) => {
const courseGrade = calculateCourseGrade(course.Id);
                const progressChart = getProgressChart(course.Id);
                const courseGrades = grades.filter(g => (g.course_id_c || g.courseId) === course.Id);
                
                return (
                  <Card key={course.Id} className="transform hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                            style={{ backgroundColor: course.color_c || course.color }}
                          >
                            <ApperIcon name="BookOpen" size={20} className="text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{course.Name || course.name}</CardTitle>
                            <p className="text-sm text-gray-600">{course.code_c || course.code} • {course.credits_c || course.credits} credits</p>
                          </div>
                        </div>
                        
                        {courseGrade !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {getGradeLevel(courseGrade)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {courseGrade.toFixed(1)}% • {calculateGPA(courseGrade).toFixed(1)} GPA
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Grade Categories */}
                      {courseGrades.length > 0 ? (
                        <div className="space-y-3">
                          {courseGrades.map((grade) => (
                            <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{grade.category_c || grade.category}</h4>
                                <p className="text-sm text-gray-600">{grade.weight_c || grade.weight}% of final grade</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">
                                  {grade.average_c || grade.average || 85}%
                                </div>
                                {((grade.scores_c || grade.scores) && Array.isArray(grade.scores_c || grade.scores) && (grade.scores_c || grade.scores).length > 0) && (
                                  <p className="text-xs text-gray-500">
                                    {(grade.scores_c || grade.scores).length} assignment{(grade.scores_c || grade.scores).length !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <ApperIcon name="BarChart3" size={24} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No grades available for this course</p>
                        </div>
                      )}
                      
                      {/* Progress Chart */}
                      {progressChart && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Grade Trend</h4>
                          <ReactApexChart
                            options={progressChart.options}
                            series={progressChart.series}
                            type="line"
                            height={200}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </motion.div>

          {/* Grade Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ? (
                  <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    height={300}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ApperIcon name="PieChart" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Grades;