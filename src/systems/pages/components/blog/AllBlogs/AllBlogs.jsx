import React, { useEffect, useState } from "react";
import { Button, Pagination } from "antd";
import {
    DeleteBlogService,
    getAllBlogservice,
} from "../../../../../services/blogService";
import { RouterDTO } from "../../../../../utils/routers.dto";
import { useNavigate } from "react-router-dom";
import usePagination from "../../../../../hook/usePagination";
import { HandleApi } from "../../../../../services/handleApi";
import Swal from "sweetalert2";

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const { data, meta, handleChangePage } = usePagination({
        api: getAllBlogservice,
        page: 1,
        pageSize: 10,
        isToken: true,
        is_load_more: false,
    });

    useEffect(() => {
        if (data) {
            setBlogs(data);
        }
    }, [data]);

    const handleUpdate = (slug) => {
        navigate(RouterDTO.blog.handleBlogs + `?slug=${slug}`);
    };

    const handleChangePagination = (index) => {
        handleChangePage(index);
    };

    const handleDeleteBlog = async (id) => {
        try {
            const Res = await HandleApi(DeleteBlogService, {
                id: id,
            });

            if (Res.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Bạn đã xóa thành công",
                });
            }
            window.location.reload();
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Có Lỗi Xảy Ra Vui Lòng Thử Lại Sau!",
                footer: '<a href="https://fstack.com.vn/">Tại sao tôi gặp vấn đề này?</a>',
            });
        }
    };
    return (
        <div>
            <p className="text-center text-[20px] font-[600] my-[10px]">
                Quản lí bài viết
            </p>
            <div className="table_blogs">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="">
                            <th>ID</th>
                            <th>Tên bài viết</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td className="h-[50px] text-center ">
                                        {item.id}
                                    </td>
                                    <td>{item.title}</td>
                                    <td className="text-center ">
                                        {item.is_active ? "Hiển thị" : "Ẩn"}
                                    </td>

                                    <td className="text-center">
                                        <Button
                                            onClick={() =>
                                                handleUpdate(item.slug)
                                            }
                                            type={"primary"}
                                        >
                                            Update
                                        </Button>

                                        <Button
                                            danger
                                            className="mx-[10px]"
                                            onClick={() =>
                                                handleDeleteBlog(item.id)
                                            }
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="ml-[50%] translate-x-[-50%]">
                {meta && meta.currentPage <= meta.totalPages && (
                    <Pagination
                        className="w-full my-[10px]"
                        defaultCurrent={1}
                        total={meta.totalItems}
                        onChange={handleChangePagination}
                    ></Pagination>
                )}
            </div>
        </div>
    );
}
