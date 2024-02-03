import {
    FileDoneOutlined,
    PieChartOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import {
    childrenList,
    sideBarList,
    urlchildrenList,
} from "../../../data/dataMenu/dataMenu";
import { useNavigate } from "react-router-dom";

const items = [
    PieChartOutlined,
    FileDoneOutlined,
    FileDoneOutlined,
    FileDoneOutlined,
    FileDoneOutlined,
    ScheduleOutlined,
].map((icon, index) => {
    const key = index;
    return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `${sideBarList[key]}`,
        children:
            childrenList[key] &&
            childrenList[key].map((childLabel, childIndex) => ({
                key: urlchildrenList[key][childIndex],
                label: childLabel,
            })),
    };
});

const MenuSideBar = () => {
    const router = useNavigate();
    const onClick = (e) => {
        router(e.key);
    };

    return (
        <>
            <Menu
                onClick={onClick}
                style={{ width: 256 }}
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub0", "sub1"]}
                mode="inline"
                items={items}
                className="customize-menu-antd"
            />
        </>
    );
};

export default MenuSideBar;
