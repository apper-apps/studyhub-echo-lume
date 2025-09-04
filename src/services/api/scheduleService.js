import { toast } from "react-toastify";

class ScheduleService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'schedule_c';
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
          "Name": "course_name_c"
        }
      },
      {
        "field": {
          "Name": "day_of_week_c"
        }
      },
      {
        "field": {
          "Name": "start_time_c"
        }
      },
      {
        "field": {
          "Name": "end_time_c"
        }
      },
      {
        "field": {
          "Name": "type_c"
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
      }
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.tableFields,
        orderBy: [
          {
            fieldName: "day_of_week_c",
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
        console.error("Error fetching schedule:", error?.response?.data?.message);
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
        console.error(`Error fetching schedule item with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: this.tableFields,
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedule by course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(scheduleData) {
    try {
      const params = {
        records: [
          {
            Name: scheduleData.course_name_c || scheduleData.courseName || "New Schedule Item",
            course_id_c: parseInt(scheduleData.course_id_c || scheduleData.courseId),
            course_name_c: scheduleData.course_name_c || scheduleData.courseName,
            day_of_week_c: scheduleData.day_of_week_c || scheduleData.dayOfWeek,
            start_time_c: scheduleData.start_time_c || scheduleData.startTime,
            end_time_c: scheduleData.end_time_c || scheduleData.endTime,
            type_c: scheduleData.type_c || scheduleData.type || "lecture",
            room_c: scheduleData.room_c || scheduleData.room,
            color_c: scheduleData.color_c || scheduleData.color,
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
          console.error(`Failed to create ${failedRecords.length} schedule records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating schedule record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, scheduleData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: scheduleData.course_name_c || scheduleData.courseName || "Updated Schedule Item",
            course_id_c: parseInt(scheduleData.course_id_c || scheduleData.courseId),
            course_name_c: scheduleData.course_name_c || scheduleData.courseName,
            day_of_week_c: scheduleData.day_of_week_c || scheduleData.dayOfWeek,
            start_time_c: scheduleData.start_time_c || scheduleData.startTime,
            end_time_c: scheduleData.end_time_c || scheduleData.endTime,
            type_c: scheduleData.type_c || scheduleData.type,
            room_c: scheduleData.room_c || scheduleData.room,
            color_c: scheduleData.color_c || scheduleData.color
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
          console.error(`Failed to update ${failedUpdates.length} schedule records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating schedule record:", error?.response?.data?.message);
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
          console.error(`Failed to delete ${failedDeletions.length} schedule records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting schedule record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export const scheduleService = new ScheduleService();