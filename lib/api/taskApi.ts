import axios from "axios";
import {createTaskFormData} from "@/lib/utils/createTaskFormData";

const API_BASE_URL = 'https://api.devtrack.dedyn.io/api/v1/task';
export const updateTaskInDB = async (updatedTask: Task) => {
    const formData = createTaskFormData(updatedTask)
    await axios.put(API_BASE_URL, formData,
    {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
}

export const addTaskInDB = async (task: Task) => {
    try {
        const formData = createTaskFormData(task)
        const response = await axios.post(API_BASE_URL, formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.toString();
    } catch (error) {
        throw error;
    }
};

export const fetchTasks = async () => {
    try {
        const response = await axios.get(API_BASE_URL, {
            withCredentials: true,
        });
        return response.data
    }catch (error: any){
        throw error;
    }
}

export const deleteTaskInDB = async (taskId: string) => {

    try {
        const response = await axios.delete(`${API_BASE_URL}/${taskId}`,
            {
                withCredentials: true,
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTaskStatusInDB = async (taskId: string, newStatus: string) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${taskId}/status`, null, {
            params: {
                status: newStatus,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};




