import React from "react";
import AllUser from "./AllUser/AllUser";
import { RouterDTO } from "../../../../utils/routers.dto";
import { useLocation, useNavigate } from "react-router";
import { Tabs } from "antd";

export default function User() {
    const user = [
        {
            key: RouterDTO.user.allUser,
            label: "Tất cả người dùng",
            children: <AllUser />,
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
                defaultActiveKey={RouterDTO.user.allUser}
                items={user}
                onChange={onChange}
            />
        </div>
    );
}
