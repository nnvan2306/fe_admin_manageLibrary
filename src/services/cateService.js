import axios from "../axios";

export function createCategoriesService(data) {
    return axios.post("/cate", data, {
        withCredentials: true,
    });
}

export function getAllCateService({ page = 1, pageSize = 8 }) {
    return axios.get(`/cate?page=${page}&pageSize=${pageSize}`, {
        withCredentials: true,
    });
}

export function UpdateCateService(data) {
    return axios.put("/cate/update", data, {
        withCredentials: true,
    });
}

export function getAllOptionsCateService() {
    return axios.get("/cate/filter-all");
}
