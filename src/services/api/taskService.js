import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByProject(projectId) {
    await this.delay();
    return this.tasks.filter(t => t.projectId === parseInt(projectId));
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      completedAt: null,
      projectId: parseInt(taskData.projectId),
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = { 
      ...this.tasks[index], 
      ...taskData,
      completedAt: taskData.status === "done" ? new Date().toISOString() : null
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const taskService = new TaskService();