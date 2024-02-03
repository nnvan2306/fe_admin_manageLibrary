import React from "react";
import { Route, Routes } from "react-router-dom";
import { RouterDTO } from "../utils/routers.dto";
import Auth from "../systems/auth/Auth";
import PrivateRouter from "../components/PrivateRouter/PrivateRouter";
import DashBoard from "../systems/pages/DashBoard/DashBoard";

export default function RouterComponent() {
    return (
        <>
            <Routes>
                <Route
                    element={
                        // <PrivateRouter>
                        // </PrivateRouter>
                        <DashBoard />
                    }f
                    path={RouterDTO.dashboard}
                />
                {/* <Route path={RouterDTO.auth} element={<Auth />} /> */}
            </Routes>
        </>
    );
}
