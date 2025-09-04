import { toast } from "react-toastify";

class AssignmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
    this.tableFields = [
      {
        "field": {
          "Name": "Name"
        }
      },
      {
        "field": {
          "Name": "Tags"
        }
      },
      {
        "field": {
          "Name": "course_id_c"
        }
      },
      {
        "field": {
          "Name": "title_c"
        }
      },
      {
        "field": {
          "Name": "description_c"
        }
      },
      {
        "field": {
          "Name": "due_date_c"
        }
      },
      {
        "field": {
          "Name": "priority_c"
        }
      },
      {
        "field": {
          "Name": "completed_c"
        }
      },
      {
        "field": {
          "Name": "grade_c"
        }
      },
      {
        "field": {
          "Name": "category_c"
        }
      }
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.tableFields,
        orderBy: [
          {
            fieldName: "due_date_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.tableFields
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [
          {
            Name: assignmentData.title_c || assignmentData.title || "New Assignment",
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId),
            title_c: assignmentData.title_c || assignmentData.title,
            description_c: assignmentData.description_c || assignmentData.description || "",
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            priority_c: assignmentData.priority_c || assignmentData.priority,
            completed_c: assignmentData.completed_c || assignmentData.completed || "false",
            grade_c: assignmentData.grade_c || assignmentData.grade || null,
            category_c: assignmentData.category_c || assignmentData.category || "assignment",
            Tags: ""
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} assignment records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: assignmentData.title_c || assignmentData.title || "Updated Assignment",
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId),
            title_c: assignmentData.title_c || assignmentData.title,
            description_c: assignmentData.description_c || assignmentData.description,
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            priority_c: assignmentData.priority_c || assignmentData.priority,
            completed_c: assignmentData.completed_c || assignmentData.completed?.toString() || "false",
            grade_c: assignmentData.grade_c || assignmentData.grade,
            category_c: assignmentData.category_c || assignmentData.category
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} assignment records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} assignment records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export const assignmentService = new AssignmentService();
