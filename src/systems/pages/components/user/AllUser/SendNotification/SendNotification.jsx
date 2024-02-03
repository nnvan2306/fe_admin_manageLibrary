import { Button } from "antd";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { HandleApi } from "../../../../../../services/handleApi";
import { sendEmailService } from "../../../../../../services/userService";

export default function SendNotification({ data, contentNotify }) {
    const [sent, setSent] = useState(false);
    const [isLoadingSend, setIsLoadingSend] = useState(false);

    // handle send notification

    useEffect(() => {
        setSent(false);
    }, [contentNotify]);

    const handleValidate = () => {
        let isValid = true;
        if (!contentNotify) {
            isValid = false;
            Swal.fire({
                icon: "warning",
                title: "Bạn vui lòng tạo thông báo trường khi gửi !",
            });
        }
        return isValid;
    };

    const handleSendAgain = async () => {
        const swal = await Swal.fire({
            title: "Bạn có chắc muốn gửi thông báo thêm lần nữa ?",
            showDenyButton: true,
            confirmButtonText: "Ok",
            denyButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (result.isDenied) {
                return false;
            }
        });

        return swal;
    };

    const handleSendOnly = async () => {
        setIsLoadingSend(true);
        const check = handleValidate();
        if (!check) {
            setIsLoadingSend(false);
            return;
        }

        if (sent) {
            const checkSendAgain = await handleSendAgain();
            if (!checkSendAgain) {
                setIsLoadingSend(false);
                return;
            }
        }

        let dataBuilder = {
            html: contentNotify,
            email: data.email,
        };
        try {
            const Res = await HandleApi(sendEmailService, dataBuilder);
            if (Res.statusCode >= 200 && Res.statusCode < 400) {
                Swal.fire({
                    icon: "success",
                    title: "Gửi thành công",
                });
                setSent(true);
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lỗi vui lòng thử lại sau !",
            });
        }
        setIsLoadingSend(false);
    };

    return (
        <Button
            type={sent ? "danger" : "primary"}
            loading={isLoadingSend}
            onClick={handleSendOnly}
            className="bg-[#bdbdbd]"
        >
            {sent ? "Đã gửi thông báo" : "Gửi thông báo"}
        </Button>
    );
}

SendNotification.propTypes = {
    data: PropTypes.object,
    contentNotify: PropTypes.string,
};
