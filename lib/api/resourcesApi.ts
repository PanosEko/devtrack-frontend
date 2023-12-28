import axios from "axios";
//
// const TASK_BASE_URL = "http://localhost:8080/api/v1/resources/tasks";
// const IMAGE_BASE_URL = "http://localhost:8080/api/v1/resources/images";

const TASK_BASE_URL = 'https://api.devtrack.dedyn.io/api/v1/resources/tasks';
const IMAGE_BASE_URL = 'https://api.devtrack.dedyn.io/api/v1/resources/images';

export const updateTaskInDB = async (task: Task, image: Thumbnail | null) => {
  try {
    const response = await axios.put(
      TASK_BASE_URL,
      { ...task, imageId: image ? image.id : undefined },
      {
        withCredentials: true,
      },
    );
    return response.data.toString();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addTaskInDB = async (task: Task, image: Thumbnail | null) => {
  try {
    const response = await axios.post(
      TASK_BASE_URL,
      { ...task, imageId: image ? image.id : undefined },
      {
        withCredentials: true,
      },
    );
    return response.data.toString();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get(TASK_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const deleteTaskInDB = async (taskId: string) => {
  try {
    const response = await axios.delete(`${TASK_BASE_URL}/${taskId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTaskStatusInDB = async (
  taskId: string,
  newStatus: string,
) => {
  try {
    const response = await axios.put(
      `${TASK_BASE_URL}/${taskId}/status`,
      null,
      {
        params: {
          status: newStatus,
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteImageInDB = async (id: String) => {
  try {
    const response = await axios.delete(`${IMAGE_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadImageInDB = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(IMAGE_BASE_URL, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchImage = async (imageId: string) => {
  try {
    return await axios.get(`${IMAGE_BASE_URL}/download/${imageId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};







