import React, { useState } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Button, Col, Divider, Row, Typography } from "antd";
import Swal from "sweetalert2";
import { HandleApi } from "../../../../../../services/handleApi";
import { createCategoriesService } from "../../../../../../services/cateService";
import handleUploadImageMarkdown from "../../../../../../helpers/handleUploadImageMarkdown";

const { Paragraph } = Typography;
const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function CreateCategories() {
    const [isLoading, setIsLoading] = useState(false);
    const [nameCate, setNameCate] = useState("");
    const [active, setActive] = useState("");
    const [desc, setDesc] = useState({
        html: "",
        text: "",
    });

    function handleEditorChange({ html, text }) {
        setDesc({ html: html, text: text });
    }

    const handleValidate = () => {
        let isValid = true;
        const arrClone = [nameCate, active, desc.html, desc.text];
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

    const handleCreateCate = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }

        let dataBuider = {
            title: nameCate,
            description: desc.html,
            description_markdown: desc.text,
            is_active: active === "active" ? true : false,
        };

        try {
            const Res = await HandleApi(createCategoriesService, dataBuider);
            if (Res.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Bạn đã tạo thành công",
                });
                setNameCate("");
                setActive("");
                setDesc({
                    html: "",
                    text: "",
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xãy ra lỗi bạn vui lòng thử lại !",
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="ml-5">
            <p className="text-2xl font-[600]">Tạo Danh Mục Sách</p>
            <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                className="py-2 text-justify font-[600] mt-4"
            >
                Danh mục sách thường là một danh sách hoặc bảng tổng hợp các đầu
                sách, tài liệu, hoặc các tác phẩm văn học được sắp xếp theo các
                tiêu chí nhất định. Danh mục sách có thể được tạo ra để quản lý
                một bộ sưu tập, làm tài liệu tham khảo cho một chủ đề cụ thể,
                hoặc để giới thiệu cho độc giả một loạt các tác phẩm liên quan
                đến một lĩnh vực hay chủ đề nhất định.
                <br />
                <Divider />
                Danh mục sách thường bao gồm thông tin về tựa đề, tác giả, năm
                xuất bản, nhà xuất bản, và mô tả ngắn về nội dung của từng cuốn
                sách. Đối với những danh mục sách lớn hơn, chúng thường được
                chia thành các danh mục con hoặc theo các chủ đề cụ thể để dễ
                dàng tìm kiếm và tra cứu.
            </Paragraph>
            <Row gutter={16}>
                <Col span={12}>
                    <div className="mt-8 w-[100%]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                            Tên danh mục sách
                        </label>
                        <input
                            value={nameCate}
                            type="text"
                            className="dark:text-white bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[100%]"
                            placeholder="tên danh mục"
                            required
                            onChange={(e) => setNameCate(e.target.value)}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div className="mt-8 w-[100%]">
                        <label className="block mb-2 text-sm font-medium text-gray-900  mt-5">
                            Trạng thái
                        </label>
                        <select
                            className="dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => setActive(e.target.value)}
                            value={active}
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="active">Hiện</option>
                            <option value="unactive">Ẩn</option>
                        </select>
                    </div>
                </Col>
            </Row>
            <div className="mt-10">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    Nhập Tên Sách Của Bạn
                </label>
                <MdEditor
                    onImageUpload={handleUploadImageMarkdown}
                    value={desc.text}
                    style={{ height: "500px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </div>
            <div className="w-full flex flex-row-reverse mt-6">
                <div className="w-[100%]">
                    <Button
                        onClick={handleCreateCate}
                        loading={isLoading}
                        type="primary"
                        className="block float-right"
                    >
                        Tạo Mới Danh Mục
                    </Button>
                </div>
            </div>
        </div>
    );
}
