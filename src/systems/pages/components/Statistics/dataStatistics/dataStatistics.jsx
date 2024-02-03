import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { HandleApi } from "../../../../../services/handleApi";
import { orderLineChartService } from "../../../../../services/orderService";
import { bookLineChart } from "../../../../../services/bookService";
import { userLineChartService } from "../../../../../services/userService";

// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

//fake dữ liệu
const generateRandomData = () => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 200));
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Thống kê dữ liệu người mượn",
        },
    },
    scales: {
        x: {
            type: "category", // Sử dụng 'category' scale cho trục x
        },
        y: {
            type: "linear", // Sử dụng 'linear' scale cho trục y
        },
    },
};

const DataStatistics = () => {
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const _fetch = async () => {
            const [ResOrder, ResBook, ResUser] = await Promise.all([
                await HandleApi(orderLineChartService),
                await bookLineChart(),
                await userLineChartService(),
            ]);
            setOrders(ResOrder);
            setBooks(ResBook);
            setUsers(ResUser);
        };

        _fetch();
    }, []);

    const data = {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        datasets: [
            {
                label: "Sách Mượn",
                data: orders,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Sách Hệ Thống",
                data: books,
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "User Hệ Thống",
                data: users,
                borderColor: "rgb(100,90, 95)",
                backgroundColor: "rgb(100,90, 95)",
            },
        ],
    };

    return <Line className="h-[500px]" options={options} data={data} />;
};

export default DataStatistics;
