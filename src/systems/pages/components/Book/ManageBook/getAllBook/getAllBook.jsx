import React, { useEffect, useState } from "react";
import { HandleApi } from "../../../../../../services/handleApi";
import { GetAllBooksService } from "../../../../../../services/bookService";
import { BASE_URL } from "../../../../../../utils/constant";
import { Image, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { RouterDTO } from "../../../../../../utils/routers.dto";
import usePagination from "../../../../../../hook/usePagination";

export default function GetAllBook() {
    const [book, setBook] = useState([]);
    const navigate = useNavigate();

    const { isLoading, data, meta, handleChangePage } = usePagination({
        api: GetAllBooksService,
        page: 2,
        pageSize: 10,
        isToken: true,
        is_load_more: false,
    });

    // useEffect(() => {
    //     const _fetch = async () => {
    //         const Res = await HandleApi(GetAllBooksService, {
    //             page: 1,
    //             pageSize: 10,
    //         });
    //         setBook(Res.items);
    //     };
    //     _fetch();
    // }, []);

    const handleUpdate = (slug) => {
        navigate(RouterDTO.book.handleBook + `?slug=${slug}`);
    };

    useEffect(() => {
        if (data) {
            setBook(data);
        }
    }, [data]);

    // change paginaton

    const handleChangePagination = (index) => {
        handleChangePage(index);
    };
    return (
        <div>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên sách</th>
                        <th>Trạng thái</th>
                        <th>Số lượng sách</th>
                        <th>Ảnh preview Sách</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {book.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td className="h-[50px] text-center ">
                                    {item.id}
                                </td>
                                <td className="text-center">{item.title}</td>
                                <td className="text-center ">
                                    {item.is_active ? "Hiển thị" : "Ẩn"}
                                </td>
                                <td className="text-center w-[100px]">
                                    {item.stock}
                                </td>
                                <td className="text-center">
                                    <Image
                                        src={`${BASE_URL}/upload/folder/app/${item.thumbnail_url}/book`}
                                        width={50}
                                        height={50}
                                        style={{
                                            borderRadius: "5px",
                                        }}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="bg-[#ff8383] p-4 rounded-md ml-[50%] translate-x-[-50%] text-[#fff]"
                                        onClick={() => handleUpdate(item.slug)}
                                    >
                                        update
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
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
