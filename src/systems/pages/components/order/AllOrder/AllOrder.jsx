import { Pagination, Select, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { columnsTableOrder } from "../../../../../data/dataTableOrder/dataTableOrder";
import ModalInfoUser from "./ModalInfoUser/ModalInfoUser";
import usePagination from "../../../../../hook/usePagination";
import {
    getAllOrder,
    updateActiveOrder,
} from "../../../../../services/orderService";
import { dataActivePaid } from "../../../../../data/dataActive/dataActive";
import { HandleApi } from "../../../../../services/handleApi";
import Swal from "sweetalert2";

export default function AllOrder() {
    const [orders, setOrders] = useState([]);
    const [isReLoad, setIsReLoad] = useState(true);

    const { isLoading, data, meta, handleChangePage } = usePagination({
        api: getAllOrder,
        page: 1,
        pageSize: 10,
        isToken: true,
        is_load_more: false,
        is_reload: isReLoad,
    });

    const handleChangePagination = (index) => {
        handleChangePage(index);
    };

    useEffect(() => {
        let dataOrder = data.map((item) => {
            return {
                id: item.id,
                title: item.book.title,
                time_order: new Date(item.time_order).toLocaleString(),
                expire_give_book: new Date(
                    item.expire_give_book
                ).toLocaleString(),
                is_give_book_back: item.is_give_book_back,
                user: item.user,
            };
        });
        setOrders(dataOrder);
    }, [data]);

    const handleUpdateActive = async (data) => {
        console.log(data);

        let dataBuider = {
            id: data.id,
            is_give_book_back: !data.is_give_book_back,
        };
        try {
            const Res = await HandleApi(updateActiveOrder, dataBuider);
            if (Res.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật trạng thái thành công",
                });
                setIsReLoad(!isReLoad);
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Đơn mượn này đã được cập nhật không thể cập nhật lại !",
            });
        }
    };

    return (
        <div className="w-full">
            <Spin spinning={isLoading} fullscreen />
            <p className="my-[15px]">quản lí đơn mượn sách</p>
            <div className="">
                <Table
                    pagination={false}
                    bordered
                    virtual
                    scroll={{ x: 400, y: 400 }}
                    rowKey="id"
                    dataSource={orders}
                    columns={columnsTableOrder.map((item) => {
                        if (item.dataIndex === "is_give_book_back") {
                            item.render = (...data) => {
                                return (
                                    <Select
                                        className="select w-full h-[35px] rounded-[6px]"
                                        options={dataActivePaid}
                                        value={data[0] ? "true" : "false"}
                                        onChange={() =>
                                            handleUpdateActive(data[1])
                                        }
                                    />
                                );
                            };
                        }
                        if (item.dataIndex === "title") {
                            item.render = (...data) => {
                                return <a>{data[0]}</a>;
                            };
                        }
                        if (item.dataIndex === "user") {
                            item.render = (...data) => {
                                return (
                                    <ModalInfoUser dataUser={data[1].user} />
                                );
                            };
                        }
                        if (item.dataIndex === "action") {
                            item.render = (...data) => {
                                const active =
                                    new Date(
                                        data[1].expire_give_book
                                    ).getTime() > new Date().getTime();
                                return (
                                    <div
                                        className={`h-[40px] rounded-lg text-center	leading-[40px] text-white

                                        ${
                                            data[1].is_give_book_back
                                                ? "bg-green-400"
                                                : active
                                                ? "bg-green-400"
                                                : "bg-[red]"
                                        }`}
                                    >
                                        {data[1].is_give_book_back
                                            ? "Đã trả sách"
                                            : active
                                            ? "Chưa hết hạn"
                                            : "Đã hết hạn"}
                                    </div>
                                );
                            };
                        }

                        return item;
                    })}
                />
            </div>
            <div className="ml-[50%] translate-x-[-50%] w-[20%]">
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
