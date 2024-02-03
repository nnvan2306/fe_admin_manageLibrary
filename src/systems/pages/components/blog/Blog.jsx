import React from "react";
import { RouterDTO } from "../../../../utils/routers.dto";
import CreateBlog from "./CreateBlog/CreateBlog";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import AllBlogs from "./AllBlogs/AllBlogs";

export default function Blog() {
    const blogs = [
        {
            key: RouterDTO.blog.handleBlogs,
            label: "Tạo bài viết",
            children: <CreateBlog />,
        },
        {
            key: RouterDTO.blog.allBlog,
            label: "Tất cả bài viết",
            children: <AllBlogs />,
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
                defaultActiveKey={RouterDTO.blog.allBlog}
                items={blogs}
                onChange={onChange}
            />
        </div>
    );
}
