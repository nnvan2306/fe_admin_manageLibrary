import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Pagination, Row, Table } from "antd";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import { columns } from "../../../../../data/dataTableUser/dataTableUser";
import usePagination from "../../../../../hook/usePagination";
import { getAllUserService } from "../../../../../services/userService";
import handleUploadImageMarkdown from "../../../../../helpers/handleUploadImageMarkdown";
import Swal from "sweetalert2";
import SendNotification from "./SendNotification/SendNotification";
import SendNotificationAll from "./SendNotificationAll/SendNotificationAll";
import { useDebounce } from "../../../../../hook/useDebounce";
import UserSearch from "./SearchUser/UserSearch";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function AllUser() {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalSearchOpen, setIsModalSearchOpen] = useState(false);
    const [textSearch, setTextSearch] = useState("");
    const [userSearch, setUserSearch] = useState([]);
    const [desc, setDesc] = useState({
        html: "",
        text: "",
    });

    const debounce = useDebounce(textSearch, 700);
    // modal search
    const showModalSearch = () => {
        setIsModalSearchOpen(true);
    };

    const handleOkSearch = () => {
        setIsModalSearchOpen(false);
    };

    const handleCancelSearch = () => {
        setIsModalSearchOpen(false);
    };

    function handleEditorChange({ html, text }) {
        setDesc({ html: html, text: text });
    }

    // get data user

    const { isLoading, data, meta, handleChangePage } = usePagination({
        api: getAllUserService,
        page: 1,
        pageSize: 10,
        isToken: true,
        is_load_more: false,
    });

    useEffect(() => {
        if (data.length > 0) {
            setAllUsers(data);
        }
        if (textSearch) {
            if (debounce) {
                const textRegex = new RegExp(debounce, "i");
                const listUserSearch = allUsers.filter((item) => {
                    return textRegex.test(item.email) === true;
                });
                setUserSearch(
                    listUserSearch.map((item) => {
                        return item.email;
                    })
                );
            }
        } else {
            setUserSearch([]);
        }
    }, [data, debounce]);

    // modal markdown

    const showModal = () => {
        setIsModalOpenCreate(true);
    };

    const handleCancel = () => {
        Swal.fire({
            title: "Nếu bạn thoát các thông báo đã tạo sẽ không được lưu !",
            showCancelButton: true,
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsModalOpenCreate(false);
                setDesc({
                    html: "",
                    text: "",
                });
            }
        });
    };

    const handleOk = () => {
        setIsModalOpenCreate(false);
    };

    const handleNewNotify = () => {
        Swal.fire({
            title: "Bạn có muốn tạo thông báo khác ?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                setDesc({
                    html: "",
                    text: "",
                });
            }
        });
    };

    //change pagination

    const handleChangePagination = (index) => {
        handleChangePage(index);
        setTextSearch("");
        setUserSearch([]);
    };

    return (
        <div>
            <p>Người dùng</p>
            <Row justify="end" gutter={10} className="mb-10">
                <Col span={3}>
                    <Button onClick={showModalSearch}>Search</Button>
                    <Modal
                        title="Basic Modal"
                        open={isModalSearchOpen}
                        onOk={handleOkSearch}
                        onCancel={handleCancelSearch}
                    >
                        <Input
                            className="mb-[5px] rounded"
                            value={textSearch}
                            placeholder="tìm kiếm bạn đọc"
                            onChange={(e) => setTextSearch(e.target.value)}
                        ></Input>
                        <div className="max-h-[200px] overflow-auto">
                            {userSearch &&
                                userSearch.length > 0 &&
                                userSearch.map((item) => {
                                    return (
                                        <div key={item}>
                                            <UserSearch
                                                content={desc.html}
                                                user={item}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </Modal>
                </Col>
                <Col span={3}>
                    <Button
                        type="primary"
                        onClick={showModal}
                        className="w-full"
                    >
                        Tạo thông báo
                    </Button>
                    <Modal
                        title="Tạo thông báo"
                        open={isModalOpenCreate}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width={1000}
                    >
                        <Button
                            type="primary"
                            className="my-5 w-[20%] ml-[80%]"
                            onClick={handleNewNotify}
                        >
                            Tạo thông báo mới
                        </Button>
                        <MdEditor
                            onImageUpload={handleUploadImageMarkdown}
                            value={desc.text}
                            style={{ height: "500px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={handleEditorChange}
                        />
                    </Modal>
                </Col>
                <Col span={3}>
                    {allUsers && allUsers.length > 0 && (
                        <SendNotificationAll
                            data={allUsers}
                            contentNotify={desc.html}
                        />
                    )}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        pagination={false}
                        bordered
                        virtual
                        scroll={{ x: 400, y: 400 }}
                        rowKey="id"
                        dataSource={allUsers}
                        columns={columns.map((item) => {
                            if (item.dataIndex === "action") {
                                item.render = (...data) => {
                                    return (
                                        <div>
                                            <SendNotification
                                                data={data[1]}
                                                contentNotify={desc.html}
                                            />
                                        </div>
                                    );
                                };
                            }
                            return item;
                        })}
                    />
                </Col>
            </Row>
            <Row justify="center" className="my-5">
                <Col span={5}>
                    {meta && meta.currentPage <= meta.totalPages && (
                        <Pagination
                            className="w-full"
                            defaultCurrent={1}
                            total={meta.totalItems}
                            onChange={handleChangePagination}
                        ></Pagination>
                    )}
                </Col>
            </Row>
        </div>
    );
}
