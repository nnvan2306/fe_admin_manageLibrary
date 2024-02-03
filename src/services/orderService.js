import axios from "../axios";

export function getAllOrder({ page = 1, pageSize = 10 }) {
    return axios.get(
        `/order/all?filter=all&page=${page}&pageSize=${pageSize}`,
        {
            withCredentials: true,
        }
    );
}

export function updateActiveOrder(data) {
    return axios.patch("/order/update-browbook", data, {
        withCredentials: true,
    });
}

export const orderLineChartService = () => {
    return axios.get("/order/line-chart", {
        withCredentials: true,
    });
};
