/* eslint-disable react/prop-types */
import Swal from "sweetalert2";
import Slider from "react-slick";
import { Image, Switch } from "antd";
import React, { memo, useEffect, useState } from "react";
import { BASE_URL } from "../../../../../../../utils/constant";
import { HandleApi } from "../../../../../../../services/handleApi";
import { UpdateStatusImagesService } from "../../../../../../../services/bookService";

// eslint-disable-next-line react/prop-types, no-unused-vars
const PreviewListImage = ({
    data = [],
    isUpdate,
    isAddImage,
    listImagesDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [linkPreview, setLinkPreview] = useState("");
    const [dataListImages, setDataListImages] = useState([]);
    useEffect(() => {
        console.log(data, isAddImage);

        if (data.length > 0) {
            let arrLinkImage = data.map((item) => {
                return {
                    id: item.id,
                    link: isUpdate
                        ? isAddImage
                            ? URL.createObjectURL(item)
                            : `${BASE_URL}/upload/folder/app/${item.link_url}/book`
                        : URL.createObjectURL(item),
                    is_active: isUpdate
                        ? isAddImage
                            ? true
                            : item.is_active
                        : true,
                };
            });
            setDataListImages(
                isAddImage ? (prev) => [...prev, ...arrLinkImage] : arrLinkImage
            );
        }
    }, [data, isUpdate, listImagesDelete]);

    const settings = {
        customPaging: function (i) {
            return (
                <a>
                    <img
                        className="w-[50px] h-[50px] object-cover flex-shrink-0 block rounded-[50%] shadow-sm border-[1px] border-solid border-[#ccc]"
                        src={dataListImages[i]?.link}
                    />
                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    const handleClickPreviewImage = (link) => {
        setIsOpen(true);
        setLinkPreview(link);
    };

    const onChange = async (image) => {
        let dataBuider = {
            id: image.id,
            is_active: !image.is_active,
        };

        try {
            // eslint-disable-next-line no-unused-vars
            const Res = await HandleApi(UpdateStatusImagesService, dataBuider);
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lỗi bạn vui lòng thử lại sau !",
            });
        }
    };

    return (
        <div className="slider-preview-image">
            <div className="preview-image-custom-slider">
                {isOpen && (
                    <Image.PreviewGroup
                        preview={{
                            visible: isOpen,
                            onVisibleChange: (visible) => {
                                setIsOpen(visible);
                            },
                        }}
                    >
                        <Image
                            src={linkPreview}
                            className="hidden"
                            preview={(visible) => {
                                console.log(visible);
                            }}
                        />
                    </Image.PreviewGroup>
                )}
            </div>
            <Slider {...settings} defaultChecked={1}>
                {dataListImages &&
                    dataListImages.length > 0 &&
                    dataListImages.map((item, index) => (
                        <div key={index}>
                            {isUpdate ? (
                                <div className="w-full flex justify-between my-2">
                                    <div className="">
                                        <Switch
                                            defaultChecked={
                                                item.is_active ? true : false
                                            }
                                            checkedChildren="Hiện"
                                            unCheckedChildren="Ẩn"
                                            onChange={() => onChange(item)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            <Image
                                onClick={() => {
                                    handleClickPreviewImage(item.link);
                                }}
                                preview={false}
                                key={index}
                                className="w-[100%] object-cover h-200px-imp rounded-[6px] border-[1px] border-solid border-[#ccc]"
                                src={item.link}
                            />
                        </div>
                    ))}
            </Slider>
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(PreviewListImage);
