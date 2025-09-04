import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.courses];
  }

  async getById(id) {
    await this.delay(200);
    const course = this.courses.find(c => c.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    await this.delay(400);
    
    const newCourse = {
      ...courseData,
      Id: Math.max(...this.courses.map(c => c.Id), 0) + 1
    };
    
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await this.delay(350);
    
    const index = this.courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses[index] = { ...courseData, Id: id };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await this.delay(250);
    
    const index = this.courses.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const courseService = new CourseService();