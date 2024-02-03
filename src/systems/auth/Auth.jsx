import { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import Swal from "sweetalert2";
import firebase from "firebase/compat/app";
import { useDispatch, useSelector } from "react-redux";
import firebaseConfig from "../../helpers/firebase";
import {
    LogInService,
    LogInFirebaseService,
    LogOutService,
} from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../features/auth/AuthSlice";
import { configUser } from "../../utils/constant";
import "firebase/compat/auth";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userFireBase, setUserFireBase] = useState(false);

    const provider = firebaseConfig();
    const isLogin = useSelector((state) => state.authSlice.isLoginIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleValidate = () => {
        let IsValid = true;
        const ArrClone = [email, password];
        for (let i = 0; i < ArrClone.length; i++) {
            if (!ArrClone[i]) {
                IsValid = false;
                Swal.fire({
                    icon: "error",
                    title: "Bạn vui lòng nhập đủ các trường",
                });
                break;
            }
        }
        return IsValid;
    };

    const handleLogIn = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }
        let dataBuilder = {
            email: email,
            password: password,
        };
        try {
            const Res = await LogInService(dataBuilder);
            if (Res.data.user.role !== configUser.role.admin) {
                await LogOutService();
                Swal.fire({
                    icon: "error",
                    title: "Tài khoản này không có quyền truy cập bạn vui lòng thử lại bằng tài khoản khác",
                });
                return;
            }
            if (Res.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Đăng nhập thành công",
                    text: "Chào mừng bạn đến với LibraryFstack",
                    showConfirmButton: false,
                    timer: 1500,
                });
                dispatch(loginSuccess(Res.data));
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: Array.isArray(err?.response?.data?.message)
                    ? err?.response?.data?.message.join("")
                    : err?.response?.data?.message,
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isLogin) {
            navigate("/");
            return;
        } else if (!userFireBase) {
            firebase.auth().signOut();
            return;
        }
        const LoginFirebase = firebase
            .auth()
            .onAuthStateChanged(async (user) => {
                if (!user) {
                    return;
                }
                let dataBuider = {
                    email: user?.email,
                    lastName: user?.displayName,
                    avatar_url: user?.photoURL,
                };
                const _fetch = async () => {
                    try {
                        const Res = await LogInFirebaseService(dataBuider);
                        if (Res.data.user.role !== configUser.role.admin) {
                            firebase.auth().signOut();
                            Swal.fire({
                                icon: "error",
                                title: "Tài khoản này không có quyền truy cập bạn vui lòng thử lại bằng tài khoản khác",
                            });
                            return;
                        }
                        if (Res.statusCode === 200) {
                            dispatch(loginSuccess(Res.data));
                            navigate("/");
                        }
                    } catch (err) {
                        Swal.fire({
                            icon: "error",
                            title: Array.isArray(err?.response?.data?.message)
                                ? err?.response?.data?.message.join("")
                                : err?.response?.data?.message,
                        });
                        console.log(err);
                    }
                };
                _fetch();
            });
        return () => LoginFirebase();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, userFireBase]);

    return (
        <div className="h-[100vh] bg-[#fafafa]">
            <div className="container mx-auto xl:max-w-[1280px] bg-[#fafafa]">
                <Row>
                    <Col span={12}>
                        <div className="mt-[15vh] ml-20">
                            <p className="text-2xl font-medium">
                                Chào mừng bạn đến với libraryFstack
                            </p>
                            <p className="text-lg my-[20px]">
                                Quản lý thư viện của bạn một cách hiệu quả hơn
                                trên libraryFstack
                            </p>
                            <img
                                className="h-[40vh] w-[80vh] object-cover"
                                src="https://i.pinimg.com/originals/0a/cd/50/0acd5002683fbcf2b720004f201ee530.jpg"
                                alt="Hình ảnh"
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="h-[90%] w-[70%] ml-[20%] bg-[#fff] mt-[10%] shadow-2xl rounded p-5">
                            <div className="container w-[100%]">
                                <p className="text-[20px] font-medium">
                                    Đăng nhập
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-[25px]">
                                    <div className="">
                                        <button
                                            onClick={() => {
                                                firebase
                                                    .auth()
                                                    .signInWithPopup(
                                                        provider.googleAuth
                                                    );
                                                setUserFireBase(true);
                                            }}
                                            className="w-[100%] bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                        >
                                            <i className="bi bi-google mr-5 text-blue-300"></i>
                                            Log in with Google
                                        </button>
                                    </div>
                                    <div className="">
                                        <button
                                            onClick={() =>
                                                firebase
                                                    .auth()
                                                    .signInWithPopup(
                                                        provider.githubAuth
                                                    )
                                            }
                                            className="w-[100%] bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                        >
                                            <i className="bi bi-github mr-5"></i>
                                            Log in with Github
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-4 mt-8">
                                    <div className="w-[100%] col-span-2 h-[1px] border border-[#ccc] mt-3"></div>
                                    <div className="w-[100%] text-center">
                                        hoặc
                                    </div>
                                    <div className="w-[100%] col-span-2 h-[1px] border border-[#ccc] mt-3"></div>
                                </div>

                                <div className="">
                                    <div className="mb-6 my-5">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Email
                                        </label>
                                        <input
                                            value={email}
                                            type="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="ngongocvan@gmail.com"
                                            required
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="mb-6 my-5">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Password
                                        </label>
                                        <input
                                            value={password}
                                            type="password"
                                            id="password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex">
                                            <input type="checkbox" />
                                            <p className="ml-1">Remember me</p>
                                        </div>
                                        <div className="">
                                            <a
                                                className="text-[blue] ml-[40%]"
                                                href=""
                                            >
                                                Quên mật khẩu?
                                            </a>
                                        </div>
                                    </div>

                                    <div className="w-[100%] mt-5 h-[45px]">
                                        <Button
                                            className="bg-[blue] hover:bg-blue-700 text-white font-bold rounded w-[90%] ml-[5%] h-[100%]"
                                            onClick={handleLogIn}
                                            loading={isLoading}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
