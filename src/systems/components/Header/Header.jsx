import { Tooltip } from "antd";
import SearchBook from "./components/Search/Search";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="header-wp px-3 flex h-[56px] shadow-md fixed top-0 right-0 left-0 z-[999] bg-[#fff]">
            <div className="left flex flex-none m-[10px]">
                <img
                    className="logo-web mr-[5px]"
                    src="https://fstack.com.vn/wp-content/uploads/2023/07/product-design.png"
                    alt="Logo library"
                />
                <p className="text-[16px] font-[500] flex text-center items-center">
                    Thư Viện Fstack
                </p>
            </div>

            <div className="right flex flex-1 justify-end">
                {/* <div className="flex items-center ml-[100px] w-[150px]">
                    <SearchBook />
                </div> */}
                <div className="flex  items-center mr-[20px] text-[12px]">
                    <i className="bi bi-house-door mr-[4px]"></i>
                    <Link to={"/"}>Trang chủ</Link>
                </div>

                <Tooltip title={<PopperMenu></PopperMenu>} color="white">
                    <div className="account flex m-[10px]">
                        <img
                            className="avatar h-[32px] rounded-[50%] mr-[10px]"
                            src="https://bcons.com.vn/wp-content/uploads/2019/11/avatar.jpg"
                            alt="Avatar"
                        />
                        <span className="flex text-center items-center text-[14px]">
                            Duc Thanh
                        </span>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}

function PopperMenu() {
    return (
        <div className="popper-menu">
            <ul>
                <li className="px-1 py-1">
                    <i className="bi bi-file-earmark-person text-[#111] mr-3"></i>
                    <span className="text-[#111]">Hồ sơ</span>
                </li>
                <li className="px-1 py-1">
                    <i className="bi bi-box-arrow-right text-[#111] mr-3"></i>
                    <span className="text-[#111] ">Đăng xuất</span>
                </li>
            </ul>
        </div>
    );
}
