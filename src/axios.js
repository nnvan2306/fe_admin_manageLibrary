import axios from "axios";
import { BASE_URL } from "./utils/constant";

const instance = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true
});

instance.interceptors.response.use((response) => {
    // Thrown error for request with OK status code
    const { data } = response;
    return data;
});

export default instance;
