import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CheckRole, LogOutService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../features/auth/AuthSlice";
import { configUser } from "../../utils/constant";
import { HandleApi } from "../../services/handleApi";
import { useSelector } from "react-redux/es";

export default function PrivateRouter({ children }) {
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.authSlice.isLoginIn);

    async function handleDispatLogoutAndCallAPI() {
        dispatch(logoutAction());
        await LogOutService();
        navigate("/auth/login");
    }

    useEffect(() => {
        if (!isLogin) {
            navigate("/auth/login");
            return;
        }

        const _fetch = async () => {
            try {
                const Res = await HandleApi(CheckRole);
                if (Res?.role === configUser.role.admin) {
                    setAdmin(true);
                } else {
                    await handleDispatLogoutAndCallAPI();
                }
            } catch (error) {
                console.log(error);
                await handleDispatLogoutAndCallAPI();
            }
        };
        _fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, isLogin]);

    return <div>{admin ? children : <></>}</div>;
}

PrivateRouter.propTypes = {
    children: PropTypes.node,
};
