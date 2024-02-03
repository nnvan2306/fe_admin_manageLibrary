import React from "react";
import GetAllBook from "./ManageBook/getAllBook/getAllBook";
import { useLocation, useNavigate } from "react-router";
import { RouterDTO } from "../../../../utils/routers.dto";
import { Tabs } from "antd";
import HandleBook from "./ManageBook/CreateBook/handleBook";

export default function Book() {
    const book = [
        {
            key: RouterDTO.book.handleBook,
            label: "Tạo sách",
            children: <HandleBook />,
        },
        {
            key: RouterDTO.book.allBook,
            label: "Tất cả sách",
            children: <GetAllBook />,
        },
    ];

    const navigate = useNavigate();
    const locations = useLocation();
    const onChange = (key) => {
        navigate(`${key}`);
    };
    return (
        <div>
            <Tabs
                className=""
                activeKey={locations.pathname}
                defaultActiveKey={RouterDTO.book.handleBook}
                items={book}
                onChange={onChange}
            />
        </div>
    );
}
