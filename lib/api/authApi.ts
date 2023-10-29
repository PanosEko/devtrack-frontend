import axios from "axios";

const API_BASE_URL = 'https://api.devtrack.dedyn.io/api/v1/auth';

export const refreshToken =  async () => {
    try{

        await axios.post(`${API_BASE_URL}/refresh`,null, {
            withCredentials: true,
        });
    } catch (error: any) {
        console.log("Throwing error in refresh func")
        throw error;
    }
}

export const authenticateUser = async (user: any) => {
    try {
        return await axios.post(
            `${API_BASE_URL}/authenticate`, user, {
                withCredentials: true,
            });
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (user: any) => {
    try {
        return await axios.post(`${API_BASE_URL}/register`, user, {
            withCredentials: true,
        });
    } catch (error) {
        throw error;
    }
};

export const logOutUser = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/logout`, null, {
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data.error;
    }
};



