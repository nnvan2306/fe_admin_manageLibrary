import axios from "../axios";

export function createBlogService(data) {
    return axios.post("/blog", data, {
        withCredentials: true,
    });
}

export function getAllBlogservice({ page = 1, pageSize = 10 }) {
    return axios.get(`/blog?page=${page}&pageSize=${pageSize}`, {
        withCredentials: true,
    });
}

export function UpdateBlogService(data) {
    return axios.put("/blog", data, {
        withCredentials: true,
    });
}

export function GetBlogDetailService({ slug }) {
    return axios.get(`/blog/by-slug?slug=${slug}`, {
        withCredentials: true,
    });
}
export function DeleteBlogService({ id }) {
    console.log(id);
    return axios.delete(`/blog/${id}`, {
        withCredentials: true,
    });
}
