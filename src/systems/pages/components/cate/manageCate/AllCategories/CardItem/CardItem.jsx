import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, Modal } from "antd";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Swal from "sweetalert2";
import { HandleApi } from "../../../../../../../services/handleApi";
import { UpdateCateService } from "../../../../../../../services/cateService";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../../../../features/cate/CateSlice";

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function CardItem({ cate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isMarkdown, setIsMarkdown] = useState(false);
    const [title, setTitle] = useState(cate.title);
    const [active, setActive] = useState(
        cate.is_active ? "active" : "unactive"
    );
    const [desc, setDesc] = useState({
        html: cate.description,
        text: cate.description_markdown,
    });
    const dispatch = useDispatch();

    // modal update with markdown
    function handleEditorChange({ html, text }) {
        setDesc({ html: html, text: text });
    }

    const handleOk = () => {
        setIsMarkdown(false);
    };

    const handleCancel = () => {
        Swal.fire({
            title: "Nếu bạn thoát các thay đổi sẽ không được lưu?",
            showCancelButton: true,
            confirmButtonText: "OK",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsMarkdown(false);
                setDesc({
                    html: cate.description,
                    text: cate.description_markdown,
                });
            }
        });
    };

    // update categories

    const handleCancelUpdate = () => {
        Swal.fire({
            title: "Bạn có chắc hủy các thay đổi",
            showCancelButton: true,
            confirmButtonText: "OK",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsUpdate(false);
                setTitle(cate.title);
                setActive(cate.is_active);
                setDesc({
                    html: cate.description,
                    text: cate.description_markdown,
                });
            }
        });
    };

    const handleValid = () => {
        let isValid = true;
        const arrClone = [title, active, desc.html, desc.text];
        for (let i = 0; i < arrClone.length; i++) {
            if (!arrClone[i]) {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    title: "Bạn vui lòng không để trống các trường",
                });
                break;
            }
        }
        return isValid;
    };
    const handleUpdate = async () => {
        console.log("a");
        setIsLoading(true);
        const check = handleValid();
        if (!check) {
            setIsLoading(false);
            return;
        }

        let dataBuider = {
            id: cate.id,
            title: title,
            description: desc.html,
            description_markdown: desc.text,
            is_active: active === "active" ? true : false,
        };
        console.log(dataBuider);

        try {
            const Res = await HandleApi(UpdateCateService, dataBuider);
            if (Res.statusCode === 200) {
                setIsUpdate(false);
                dispatch(updateData(dataBuider));
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công",
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lỗi vui lòng thử lại !",
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="h-[100%] w-full">
            <Card
                hoverable
                className={`h-full rounded-md relative shadow-sm ${
                    isUpdate ? "overflow-hidden " : ""
                }`}
            >
                <div
                    className={`${
                        isUpdate
                            ? "blur-sm absolute top-0 left-0 right-0 bottom-0 w-[100%] h-[100%] z-[10]"
                            : "hidden"
                    }`}
                >
                    <div
                        style={{
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=320&h=320&q=80)",
                        }}
                        className="absolute top-0 left-0 right-0 bottom-0 w-[100%] h-[100%] z-[10] blur-[10px]"
                    ></div>
                </div>
                <div className="relative z-[99]">
                    <div className="border-b-[1px] border-solid border-[#ccc] pb-3">
                        {isUpdate ? (
                            <div className="">
                                <input
                                    value={title}
                                    type="text"
                                    id="first_name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-blue-500"
                                    placeholder="John"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                ></input>
                                <select
                                    className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(e) => setActive(e.target.value)}
                                    value={active}
                                >
                                    {/* <option value="null">Chọn trạng thái</option> */}
                                    <option value="active">Hiện Thị</option>
                                    <option value="unactive">Đang Bị Ẩn</option>
                                </select>
                            </div>
                        ) : (
                            <p
                                className="text-center text-lg
                            font-semibold"
                            >
                                {title}
                                <br />
                                <span
                                    className="text-sm
"
                                >
                                    Trạng thái :
                                    {active === "active" ? "Hiện" : "Ẩn"}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* mô tả */}

                    <div className="h-[250px] max-h-[250px] overflow-hidden border-b-2 border-[#ccc]">
                        <div className="relative h-full w-full">
                            {/* <ModalShowContent /> */}
                            <div
                                className={`absolute z-2 h-full w-full whitespace-pre-wrap preview-markdown overflow-y-auto ${
                                    isUpdate ? "opacity-0" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: desc.html }}
                            ></div>
                            {isUpdate ? (
                                <div className="absolute z-4 w-full">
                                    <button
                                        className="mt-[50%] ml-[15%] w-[70%] bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                        onClick={() => setIsMarkdown(true)}
                                    >
                                        Thay đổi mô tả
                                    </button>
                                    <Modal
                                        open={isMarkdown}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        width={1000}
                                    >
                                        <MdEditor
                                            className="h-[500px] mt-10"
                                            value={desc.text}
                                            renderHTML={(text) =>
                                                mdParser.render(text)
                                            }
                                            onChange={handleEditorChange}
                                        />
                                    </Modal>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    {/* button setting and updtae */}

                    <div className="pt-5">
                        {isUpdate ? (
                            <div className="flex w-full">
                                <div className="w-[40%]">
                                    <Button
                                        className="w-full h-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                        onClick={handleUpdate}
                                        loading={isLoading}
                                    >
                                        Update
                                    </Button>
                                </div>
                                <div className="w-[40%] ml-10">
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                        onClick={handleCancelUpdate}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-row-reverse">
                                <div className="w-[40%]">
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                                        onClick={() => setIsUpdate(true)}
                                    >
                                        <i className="bi bi-gear"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

CardItem.propTypes = {
    cate: PropTypes.object,
};
