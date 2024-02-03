import React, { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import MarkdownIt from "markdown-it";
import { HttpStatusCode } from "axios";
import ReactSelect from "react-select";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Button, Checkbox, Col, Image, Input, Modal, Row, Select } from "antd";
import ModalExplain from "./ModalExplain/ModalExplain";
import PreviewListImage from "./slickImages/slickImages";
import { useLocation } from "react-router-dom";
import { HandleApi } from "../../../../../../services/handleApi";
import {
    GetBookDetailService,
    UpdateBookService,
    createBookService,
} from "../../../../../../services/bookService";
import handleValidateImage from "../../../../../../helpers/validateImageFile";
import { getAllOptionsCateService } from "../../../../../../services/cateService";
import { dataCategories } from "../../../../../../data/dataCategories/dateCategories";
import handleUploadImageMarkdown from "../../../../../../helpers/handleUploadImageMarkdown";
import { BASE_URL } from "../../../../../../utils/constant";

export default function HandleBook() {
    const { TextArea } = Input;
    const [title, setTitle] = useState("");
    const [markdown, setMarkdown] = useState({
        text: "",
        html: "",
    });
    const [cate, setCate] = useState([]);
    const [active, setActive] = useState(dataCategories[0].value);
    const [number, setNumber] = useState(0);
    const [thumbnail, setThumbnail] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [listImage, setListImage] = useState([]);
    const [metaDescription, setMetaDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [option, setOption] = useState([]);
    const [listImageUpdate, setListImageUpdate] = useState([]);
    const [bookCurrent, setBookCurrent] = useState(null);
    const [imageDelete, setImageDelete] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangeThumbnail, setIsChangeThumbnail] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [isAddImagesUpdate, setIsAddImagesUpdate] = useState(false);

    const refInputThumbnail = useRef(null);
    const refInputListImage = useRef(null);

    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const CheckboxGroup = Checkbox.Group;

    function handleEditorChange({ html, text }) {
        setMarkdown({ html: html, text: text });
    }

    // get options

    const _fetch = useCallback(async () => {
        try {
            const Res = await getAllOptionsCateService();
            if ((Res.statusCode = HttpStatusCode.Ok)) {
                setOption(Res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    // slug update
    const loction = useLocation();
    const slug = loction.search.slice(loction.search.search("=") + 1);
    const _fetchGetDetail = useCallback(async () => {
        try {
            setIsLoading(true);
            const Res = await HandleApi(GetBookDetailService, {
                slug: slug,
            });
            if (Res.statusCode === 200) {
                const book = Res.data;
                setBookCurrent(book);
                setTitle(book.title);
                setCate(
                    book.categories.map((item) => {
                        return {
                            value: item.cate.id,
                            label: item.cate.title,
                        };
                    })
                );
                setActive(book.is_active ? "active" : "unactive");
                setNumber(book.stock);
                setMetaDescription(book.meta_description);
                setMarkdown({
                    text: book.description_markdown,
                    html: book.description,
                });
                setThumbnailPreview(
                    `${BASE_URL}/upload/folder/app/${book.thumbnail_url}/book`
                );
                setListImageUpdate(book.images);
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lõi bạn vui lòng thử lại sau !",
            });
        }
        setIsLoading(false);
    }, [slug]);

    // reset states

    const handleResetStates = () => {
        setTitle("");
        setMarkdown({
            text: "",
            html: "",
        });
        setCate([]);
        setActive(dataCategories[0].value);
        setNumber(0);
        setThumbnail([]);
        setThumbnailPreview("");
        setListImage([]);
        setMetaDescription("");
    };

    //

    useEffect(() => {
        _fetch();
        if (slug) {
            setIsUpdate(true);
            _fetchGetDetail();
        } else {
            setIsUpdate(false);
            setListImageUpdate([]);
            handleResetStates();
        }
    }, [slug, _fetchGetDetail, _fetch]);

    const handleDeleteThumbnails = async () => {
        const isDelete = await Swal.fire({
            title: "Nếu bạn chọn ảnh thumbnail mới thì ảnh thumbnail cũ sẽ bị xóa !",
            showDenyButton: true,
            confirmButtonText: "OK",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (result.isDenied) {
                return false;
            }
        });
        return isDelete;
    };

    const handleChooseThumbnailFile = async () => {
        if (slug) {
            const CheckDeleteThumbnail = await handleDeleteThumbnails();
            if (!CheckDeleteThumbnail) {
                return;
            } else {
                setIsChangeThumbnail(true);
                setImageDelete((prev) => [...prev, bookCurrent.thumbnail_url]);
            }
        }
        const input = refInputThumbnail.current;
        if (input) {
            input.click();
        }
    };

    const handleChangeFileThumbnail = (e) => {
        const file = e.target.files[0];
        if (handleValidateImage(file)) {
            setThumbnailPreview(URL.createObjectURL(file));
            setThumbnail(file);
        }
    };

    const chooseListImageFile = (e) => {
        if (isUpdate) {
            setIsAddImagesUpdate(true);
        }
        const input = refInputListImage.current;
        if (!input) {
            return;
        }
        const files = e.target.files;
        let ImageFiles = [];
        if (files && files.length) {
            Array.from(files).map((item) => {
                if (handleValidateImage(item)) {
                    ImageFiles.push(item);
                }
            });
            console.log(ImageFiles);
            setListImage(ImageFiles);
        }
    };

    const handleSelectCate = (e) => {
        setCate(e);
    };

    // validate
    const handleValidate = () => {
        let isValid = true;
        const arrClone = [
            title,
            markdown.html,
            markdown.text,
            number,
            active,
            cate,
            thumbnail,
            listImage,
            metaDescription,
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

    // create book
    async function handleSubmid() {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }

        let dataBuilder = {
            title: title,
            description: markdown.html,
            description_markdown: markdown.text,
            stock: number,
            is_active: active === "active" ? true : false,
            categories: cate.map((item) => item.value),
            images: [thumbnail, ...listImage],
            meta_description: metaDescription,
        };
        try {
            const Res = await HandleApi(createBookService, dataBuilder);

            if (Res.statusCode === HttpStatusCode.Ok) {
                Swal.fire({
                    icon: "success",
                    title: "Thành Công!",
                });
                handleResetStates();
                // RevalidateBookService();
                URL.revokeObjectURL(thumbnailPreview);
                refInputThumbnail.current.value = null;
                refInputListImage.current.value = null;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Có Lỗi Xảy Ra Vui Lòng Thử Lại Sau!",
                footer: '<a href="https://fstack.com.vn/">Tại sao tôi gặp vấn đề này?</a>',
            });
        }
        setIsLoading(false);
    }

    // modal delete image
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        Swal.fire({
            title: "Bạn có chắc muốn xóa những ảnh đã chọn không ?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsModalOpen(false);
                setImageDelete(checkedList);
            }
        });
    };

    const handleCancel = () => {
        Swal.fire({
            icon: "warning",
            title: "Nếu bạn thoát các thay đổi sẽ không được lưu !",
            showCancelButton: true,
            confirmButtonText: "OK",
        }).then((result) => {
            if (result.isConfirmed) {
                setImageDelete([]);
                setCheckedList([]);
                setIsModalOpen(false);
            }
        });
    };

    // checkbox delete images

    const handleDeleteImages = (list) => {
        setCheckedList(list);
    };

    // update book

    const handleUpdateBook = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }

        let dataBuider = {
            title: title,
            description: markdown.html,
            description_markdown: markdown.text,
            stock: number,
            is_active: active === "active" ? true : false,
            categories: cate.map((item) => item.value),
            images: Array.isArray(thumbnail)
                ? listImage
                : [thumbnail, ...listImage],
            id: bookCurrent.id,
            meta_description: metaDescription,
            is_change_thumbnail: isChangeThumbnail,
            thumbnail_url: bookCurrent.thumbnail_url,
            image_delete: imageDelete,
        };

        try {
            const Res = await HandleApi(UpdateBookService, dataBuider);
            if (Res.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Bạn đã update thành công",
                });
                setCheckedList([]);
                await fetch(
                    "https://libbook.fstack.com.vn/api/revalidatebook?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJidWlsZCI6dHJ1ZX0.MhVgMq4AdHvFLy-6se9sokN2oUttJE-ZsfHSCe6YEgI&tag=detail-book"
                );
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lỗi vui lòng thử lại sau",
            });
        }
        _fetchGetDetail();
        setIsAddImagesUpdate(false);
        setIsLoading(false);
        setListImage([]);
    };

    return (
        <div className="bg-[#fff] px-4 py-6 mt-4 mb-6 shadow-sm rounded-[10px]">
            <h2 className="flex justify-center py-[20px] font-[600]">
                {slug ? "Update Book" : "Create Book"}
            </h2>
            <Row gutter={16}>
                <Col sm={12}>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Nhập Tên Sách Của Bạn
                    </label>
                    <input
                        className="w-full h-[35px] border rounded-[6px] outline-none pl-4"
                        placeholder="Vui lòng nhập tên sách...."
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Col>
                <Col sm={12}>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Chọn Danh Mục Sách
                    </label>
                    <ReactSelect
                        placeholder="Bạn hãy chọn danh mục sách (có thể chọn nhiều)"
                        value={cate}
                        onChange={handleSelectCate}
                        isMulti
                        options={option}
                        className="w-full"
                    />
                </Col>
            </Row>
            <Row className="my-[20px]" gutter={16}>
                <Col span={12}>
                    <div className="status">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Chọn Trạng Thái
                        </label>
                        <Select
                            className="select w-full h-[35px] rounded-[6px]"
                            options={dataCategories}
                            placeholder="Chọn trạng thái"
                            value={active}
                            onChange={(value) => setActive(value)}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Nhập số lượng sách
                        </label>
                        <input
                            className="pl-4 w-full h-[35px] border rounded-[6px] outline-none"
                            value={number}
                            placeholder="  Nhập số lượng sách"
                            onChange={(e) => setNumber(e.target.value)}
                            type="number"
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        meta description
                    </label>
                    <TextArea
                        className="border-[1px] w-[100%]"
                        placeholder="Nhập Meta Description cho sách (Tối đa 150 kí tự)"
                        allowClear
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                    />
                </Col>
            </Row>

            <div className="choose-images">
                <Row gutter={16}>
                    <Col sm={12}>
                        <label className="block mt-[10px] mb-[6px] text-sm font-medium text-gray-900">
                            Chọn Ảnh Thumbnail Sách
                        </label>
                        <div className="overflow-hidden shadow-sm h-[200px] border-[1px] border-solid border-[#ccc] rounded-[10px] bg-[#faf3f3] relative">
                            <input
                                onChange={handleChangeFileThumbnail}
                                ref={refInputThumbnail}
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                hidden
                            />

                            <Image
                                src={thumbnailPreview}
                                style={{
                                    display: `${
                                        thumbnailPreview ? "block" : "none"
                                    }`,
                                }}
                                className="cursor-pointer absolute h-100-imp top-0 left-0 right-0 bottom-0 z-[1] w-[100%] h-[100%] object-cover"
                                alt="Hinh Anh"
                            />
                            <button
                                onClick={handleChooseThumbnailFile}
                                className="z-[2] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:text-[#ee4d2d]"
                            >
                                <span className="text-[30px]">
                                    <i className="bi bi-upload"></i>
                                </span>
                                <p className="font-[600]">Chọn Ảnh Thumbnail</p>
                            </button>
                        </div>
                    </Col>
                    <Col sm={12} className="relative">
                        {isUpdate ? (
                            <>
                                <Button
                                    type="primary"
                                    className="absolute z-[3] right-[5px] mt-[3px]"
                                    onClick={showModal}
                                >
                                    Delete
                                </Button>
                                <Modal
                                    title="Chọn những ảnh bạn muốn xóa"
                                    open={isModalOpen}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    className=""
                                >
                                    <div
                                        className="overflow-auto"
                                        style={{ maxHeight: 300 }}
                                    >
                                        {listImageUpdate &&
                                            listImageUpdate.length > 0 && (
                                                <CheckboxGroup
                                                    className=" w-[150px]"
                                                    options={listImageUpdate.map(
                                                        (item) => {
                                                            return {
                                                                label: (
                                                                    <div
                                                                        style={{
                                                                            backgroundImage: `url(${BASE_URL}/upload/folder/app/${item.link_url}/book)`,
                                                                        }}
                                                                        className="w-[150px] h-[200px]"
                                                                    ></div>
                                                                ),
                                                                value: item.link_url,
                                                            };
                                                        }
                                                    )}
                                                    value={checkedList}
                                                    onChange={(e) =>
                                                        handleDeleteImages(e)
                                                    }
                                                />
                                            )}
                                    </div>
                                </Modal>
                            </>
                        ) : (
                            <></>
                        )}

                        <PreviewListImage
                            data={
                                isUpdate
                                    ? isAddImagesUpdate
                                        ? listImage
                                        : listImageUpdate
                                    : listImage
                            }
                            isUpdate={isUpdate}
                            isAddImage={isAddImagesUpdate}
                            listImagesDelete={checkedList}
                            // fetch={_fetchGetDetail}
                        />
                        <div className="mt-[10px]">
                            <label
                                htmlFor="file-input"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Chọn Thêm Ảnh
                            </label>
                            <input
                                ref={refInputListImage}
                                onChange={chooseListImageFile}
                                type="file"
                                name="file-input"
                                id="file-input"
                                multiple
                                accept="image/png, image/gif, image/jpeg"
                                className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600   file:bg-gray-50 file:border-0 file:me-4  file:py-3 file:px-4 dark:file:bg-gray-700 dark:file:text-gray-400"
                            />
                        </div>
                        {!listImage.length && !slug && (
                            <div className="mt-[10%] text-base flex py-3 pl-5 w-[100%] font-semibold border-[1px] border-[#ccc] rounded-lg">
                                Bạn chưa biết về danh mục sách ?
                                <ModalExplain />
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-900">
                    Nhập Mô Tả Sách
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
            <div className="flex justify-end mr-1">
                <Button
                    onClick={slug ? handleUpdateBook : handleSubmid}
                    type="primary"
                    className="mt-[10px]"
                    loading={isLoading}
                >
                    {slug ? "Update sách" : "Tạo sách"}
                </Button>
            </div>
        </div>
    );
}
