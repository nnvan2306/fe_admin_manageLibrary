import axios from "../axios";

export function getAllUserService({ page = 1, pageSize = 10 }) {
    return axios.get(`/user?page=${page}&pageSize=${pageSize}`, {
        withCredentials: true,
    });
}

export function sendEmailService(data) {
    return axios.post("/user/send-email", data, {
        withCredentials: true,
    });
}

export function sendNotifyAllService(data) {
    return axios.post("/user/send-email-many-users", data, {
        withCredentials: true,
    });
}

export const userLineChartService = () => {
    return axios.get("/user/line-chart");
};
