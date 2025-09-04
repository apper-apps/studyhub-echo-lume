import { toast } from "react-toastify";

class CourseService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'course_c';
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
          "Name": "code_c"
        }
      },
      {
        "field": {
          "Name": "instructor_c"
        }
      },
      {
        "field": {
          "Name": "room_c"
        }
      },
      {
        "field": {
          "Name": "color_c"
        }
      },
      {
        "field": {
          "Name": "semester_c"
        }
      },
      {
        "field": {
          "Name": "credits_c"
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
            fieldName: "Name",
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
        console.error("Error fetching courses:", error?.response?.data?.message);
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
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [
          {
            Name: courseData.Name || courseData.name || "New Course",
            code_c: courseData.code_c || courseData.code,
            instructor_c: courseData.instructor_c || courseData.instructor,
            room_c: courseData.room_c || courseData.room,
            color_c: courseData.color_c || courseData.color,
            semester_c: courseData.semester_c || courseData.semester,
            credits_c: courseData.credits_c || courseData.credits,
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
          console.error(`Failed to create ${failedRecords.length} course records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating course record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: courseData.Name || courseData.name || "Updated Course",
            code_c: courseData.code_c || courseData.code,
            instructor_c: courseData.instructor_c || courseData.instructor,
            room_c: courseData.room_c || courseData.room,
            color_c: courseData.color_c || courseData.color,
            semester_c: courseData.semester_c || courseData.semester,
            credits_c: courseData.credits_c || courseData.credits
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
          console.error(`Failed to update ${failedUpdates.length} course records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating course record:", error?.response?.data?.message);
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
          console.error(`Failed to delete ${failedDeletions.length} course records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export const courseService = new CourseService();
export const courseService = new CourseService();