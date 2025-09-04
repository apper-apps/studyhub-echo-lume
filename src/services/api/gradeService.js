import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.grades];
  }

  async getById(id) {
    await this.delay(200);
    const grade = this.grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async getByCourse(courseId) {
    await this.delay(250);
    return this.grades.filter(g => g.courseId === courseId).map(g => ({ ...g }));
  }

  async create(gradeData) {
    await this.delay(400);
    
    const newGrade = {
      ...gradeData,
      Id: Math.max(...this.grades.map(g => g.Id), 0) + 1
    };
    
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay(350);
    
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    this.grades[index] = { ...gradeData, Id: id };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await this.delay(250);
    
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    this.grades.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const gradeService = new GradeService();