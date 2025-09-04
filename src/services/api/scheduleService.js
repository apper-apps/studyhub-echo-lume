import scheduleData from "@/services/mockData/schedule.json";

class ScheduleService {
  constructor() {
    this.schedule = [...scheduleData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.schedule];
  }

  async getById(id) {
    await this.delay(200);
    const scheduleItem = this.schedule.find(s => s.Id === id);
    if (!scheduleItem) {
      throw new Error("Schedule item not found");
    }
    return { ...scheduleItem };
  }

  async getByCourse(courseId) {
    await this.delay(250);
    return this.schedule.filter(s => s.courseId === courseId).map(s => ({ ...s }));
  }

  async create(scheduleData) {
    await this.delay(400);
    
    const newScheduleItem = {
      ...scheduleData,
      Id: Math.max(...this.schedule.map(s => s.Id), 0) + 1
    };
    
    this.schedule.push(newScheduleItem);
    return { ...newScheduleItem };
  }

  async update(id, scheduleData) {
    await this.delay(350);
    
    const index = this.schedule.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Schedule item not found");
    }
    
    this.schedule[index] = { ...scheduleData, Id: id };
    return { ...this.schedule[index] };
  }

  async delete(id) {
    await this.delay(250);
    
    const index = this.schedule.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Schedule item not found");
    }
    
    this.schedule.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const scheduleService = new ScheduleService();