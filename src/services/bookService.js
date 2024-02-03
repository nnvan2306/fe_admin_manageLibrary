import axios from "../axios";

export function createBookService(data) {
    return axios.post("/book", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export function UpdateBookService(data) {
    return axios.put("/book", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export function GetAllBooksService({ page = 1, pageSize = 10 }) {
    return axios.get(`/book?page=${page}&pageSize=${pageSize}`, {
        withCredentials: true,
    });
}

export function GetBookDetailService({ slug }) {
    return axios.get(`/book/detail/${slug}?is_all=false`, {
        withCredentials: true,
    });
}

export function UpdateStatusImagesService(data) {
    return axios.patch("/book/update-image-status", data, {
        withCredentials: true,
    });
}

export const bookLineChart = () => {
    return axios.get("/book/line-chart");
};
