import axios from "axios";
import {createTaskFormData} from "@/lib/utils/createTaskFormData";

const TASK_BASE_URL = 'http://localhost:8080/api/v1/resources/tasks';
const IMAGE_BASE_URL = 'http://localhost:8080/api/v1/resources/images';

// const API_BASE_URL = 'https://api.devtrack.dedyn.io/api/v1/task';

// export const updateTaskInDB = async (updatedTask: Task) => {
//     const formData = createTaskFormData(updatedTask)
//     await axios.put(TASK_BASE_URL, formData,
//     {
//         withCredentials: true,
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     }
//     );
// }

export const updateTaskInDB = async (task: Task, image: Thumbnail | null) => {
    // const formData = createTaskFormData(updatedTask)
    try{
    const response = await axios.put(TASK_BASE_URL, { ...task, imageId: image ? image.id : undefined},
        {
            withCredentials: true,
        }
    );
        return response.data.toString();
    } catch (error) {
        throw error;
    }
};

export const addTaskInDB = async (task: Task, image: Thumbnail | null) => {
    try {
        const response = await axios.post(TASK_BASE_URL, { ...task, imageId: image ? image.id : undefined},
            {
                withCredentials: true,
            }
        );
        return response.data.toString();
    } catch (error) {
        throw error;
    }
};

export const fetchTasks = async () => {
    try {
        const response = await axios.get(TASK_BASE_URL, {
            withCredentials: true,
        });
        return response.data
    }catch (error: any){
        throw error;
    }
};

export const deleteTaskInDB = async (taskId: string) => {

    try {
        const response = await axios.delete(`${TASK_BASE_URL}/${taskId}`,
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
        const response = await axios.put(`${TASK_BASE_URL}/${taskId}/status`, null, {
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

export const deleteImageInDB = async (thumbnail: Thumbnail) => {

    try {
        const response = await axios.delete(`${IMAGE_BASE_URL}/${thumbnail.id}`,
            {
                withCredentials: true,
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadImageInDB = async (image: File) => {
    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await axios.post(IMAGE_BASE_URL, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchThumbnail = async (imageId: string) => {

    try {
        const response = await axios.get(`${IMAGE_BASE_URL}/${imageId}`,
            {
                withCredentials: true,
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchImage = async (imageId: string) => {
    try {
        const response = await axios.get(`${IMAGE_BASE_URL}/download/${imageId}`,
            {
                withCredentials: true,
            });
        return response;
    } catch (error) {
        throw error;
    }
}







