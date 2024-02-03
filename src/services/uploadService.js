import axios from "../axios";

export const uploadImage = (data) => {
    return axios.post("/upload", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
