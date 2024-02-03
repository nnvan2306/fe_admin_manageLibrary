import React from "react";
import { RouterDTO } from "../../../../utils/routers.dto";
import CreateCategories from "./manageCate/CreateCategories/CreateCategories";
import AllCategories from "./manageCate/AllCategories/AllCategories";
import { useLocation, useNavigate } from "react-router";
import { Tabs } from "antd";

export default function Categories() {
    const cate = [
        {
            key: RouterDTO.cate.createCate,
            label: "Tạo danh mục",
            children: <CreateCategories />,
        },
        {
            key: RouterDTO.cate.allCate,
            label: "Danh mục",
            children: <AllCategories />,
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
                defaultActiveKey={RouterDTO.cate.createCate}
                items={cate}
                onChange={onChange}
            />
        </div>
    );
}
