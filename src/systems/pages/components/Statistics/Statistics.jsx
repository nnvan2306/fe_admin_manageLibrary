import React from "react";

import { RouterDTO } from "../../../../utils/routers.dto";
import { useLocation, useNavigate } from "react-router";
import { Tabs } from "antd";
import DataStatistics from "./dataStatistics/dataStatistics";

export default function Statistics() {
    const data = [
        {
            key: RouterDTO.Statistics.dataStatistics,
            label: "Thống kê dữ liệu",
            children: <DataStatistics />,
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
                defaultActiveKey={RouterDTO.Statistics.dataStatistics}
                items={data}
                onChange={onChange}
            />
        </div>
    );
}
