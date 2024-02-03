import { Button, Col, Divider, Input, Row, Select, Typography } from "antd";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import handleUploadImageMarkdown from "../../../../../helpers/handleUploadImageMarkdown";
import { dataCategories } from "../../../../../data/dataCategories/dateCategories";
import Swal from "sweetalert2";
import { HandleApi } from "../../../../../services/handleApi";
import {
    GetBlogDetailService,
    UpdateBlogService,
    createBlogService,
} from "../../../../../services/blogService";
import { HttpStatusCode } from "axios";
import { useLocation } from "react-router-dom";

const { Paragraph } = Typography;

export default function CreateBlog() {
    const { TextArea } = Input;
    const [title, setTitle] = useState("");
    const [active, setActive] = useState(dataCategories[0].value);
    const [metaDescription, setMetaDescription] = useState("");
    const [markdown, setMarkdown] = useState({
        text: "",
        html: "",
    });
    const [isLoading, setIsLoading] = useState("false");

    const mdParser = new MarkdownIt(/* Markdown-it options */);

    function handleEditorChange({ html, text }) {
        setMarkdown({ html: html, text: text });
    }

    const handleValidate = () => {
        let isValid = true;
        const arrClone = [
            title,
            active,
            metaDescription,
            markdown.html,
            markdown.text,
        ];
        for (let i = 0; i < arrClone.length; i++) {
            if (!arrClone[i]) {
                isValid = false;
                Swal.fire({
                    icon: "error",
                    title: " Bạn vui lòng không để trống các trường !",
                });
                break;
            }
        }
        return isValid;
    };

    const resetState = () => {
        setTitle("");
        setActive(dataCategories[0].value);
        setMetaDescription("");
        setMarkdown({
            text: "",
            html: "",
        });
        setIsLoading(false);
    };

    const handleCreateBlog = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }
        let dataBuider = {
            title: title,
            is_active: active === "active" ? true : false,
            meta_description: metaDescription,
            contentHTML: markdown.html,
            contentMarkDown: markdown.text,
        };
        try {
            const Res = await HandleApi(createBlogService, dataBuider);
            console.log(Res);
            if (Res.statusCode === HttpStatusCode.Ok) {
                Swal.fire({
                    icon: "success",
                    title: "Thành Công!",
                });
                resetState();
            }
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

    //blog update by slug
    const location = useLocation();
    const RefId = useRef(null);
    const slug = location.search.slice(location.search.search("=") + 1);
    const _fetchDetail = useCallback(async () => {
        try {
            const Res = await HandleApi(GetBlogDetailService, {
                slug: slug,
            });
            if (Res.statusCode == 200) {
                RefId.current = Res.data.id;
                const blog = Res.data;
                setTitle(blog.title);
                setActive(blog.is_active ? "hiển thị" : "ẩn");
                setMetaDescription(blog.meta_description);
                setMarkdown({
                    text: blog.contentMarkDown,
                    html: blog.contentHTML,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, [slug]);

    useEffect(() => {
        _fetchDetail();
    }, [slug, _fetchDetail]);

    const handleUpdateBlog = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }
        let databuil = {
            id: RefId.current,
            title: title,
            is_active: active === "active" ? true : false,
            meta_description: metaDescription,
            contentHTML: markdown.html,
            contentMarkDown: markdown.text,
        };
        try {
            const Res = await HandleApi(UpdateBlogService, databuil);
            if (Res.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Bạn đã update thành công",
                });
            }
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
            <p className="text-2xl font-[600]">Tạo bài viết</p>
            <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                className="py-2 text-justify font-[600] mt-4"
            >
                Blog là một website thông tin riêng hoặc nhật ký trực tuyến, với
                cách trình bày các bài viết mới nhất được đưa lên đầu. Người
                viết blog có thể là cá nhân hay một nhóm nhỏ, thể hiện cái nhìn
                chủ quan của họ về một chủ đề nhất định, viết về những điều họ
                thích.
                <br />
                <Divider />
            </Paragraph>

            <Row gutter={16}>
                <Col span={12}>
                    <div className="mt-8 w-[100%]">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                            Tên bài viết
                        </label>
                        <Input
                            className="h-[40px]"
                            placeholder="tên bài viết"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div className="mt-8 w-[100%]">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Chọn Trạng Thái
                        </label>
                        <Select
                            className="select w-full h-[40px] rounded-[6px]"
                            options={dataCategories}
                            placeholder="Chọn trạng thái"
                            value={active}
                            onChange={(value) => setActive(value)}
                        />
                    </div>
                </Col>
            </Row>
            <Row className="mt-[20px]">
                <Col span={24}>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        meta description
                    </label>
                    <TextArea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="border-[1px] w-[100%]"
                        placeholder="Nhập Meta Description cho sách (Tối đa 150 kí tự)"
                        allowClear
                    />
                </Col>
            </Row>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-900">
                    Tạo nội dung bài viết
                </label>
                <MdEditor
                    value={markdown.text}
                    className="mt-[10px]"
                    style={{ height: "500px" }}
                    onImageUpload={handleUploadImageMarkdown}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </div>
            <div className="w-[10%] ml-[90%] my-[20px]">
                <Button
                    type="primary"
                    className="w-full"
                    onClick={slug ? handleUpdateBlog : handleCreateBlog}
                >
                    {slug ? "Update Blog" : "Tạo Blog"}
                </Button>
            </div>
        </div>
    );
}
