import { Col, Pagination, Row } from "antd";
import React, { useEffect, useState } from "react";
import CardItem from "./CardItem/CardItem";
import usePagination from "../../../../../../hook/usePagination";
import { getAllCateService } from "../../../../../../services/cateService";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../../../../../features/cate/CateSlice";

export default function AllCategories() {
    // const [categories, setCategories] = useState([]);
    const dataStore = useSelector((state) => state.cateSlice.data);
    const dispatch = useDispatch();

    const { isLoading, data, meta, handleChangePage } = usePagination({
        api: getAllCateService,
        page: 1,
        pageSize: 8,
        isToken: true,
        is_load_more: false,
    });

    console.log(data);

    useEffect(() => {
        if (data.length > 0) {
            // setCategories(data);
            dispatch(addData(data));
        }
    }, [data]);

    const handleChangePagination = (index) => {
        handleChangePage(index);
    };
    return (
        <div>
            <p className="text-2xl">Các Danh mục sách</p>

            <Row className="mt-5">
                {dataStore &&
                    dataStore.length > 0 &&
                    dataStore.map((cate) => {
                        return (
                            <Col
                                span={5}
                                className="mx-6 my-6 min-h-[350px]"
                                key={cate.id}
                            >
                                <CardItem cate={cate} />
                            </Col>
                        );
                    })}
            </Row>
            {meta && meta.currentPage <= meta.totalPages && (
                <Pagination
                    className="my-5"
                    style={{ paddingLeft: "35%" }}
                    defaultCurrent={1}
                    total={meta.totalItems}
                    onChange={handleChangePagination}
                />
            )}
        </div>
    );
}
