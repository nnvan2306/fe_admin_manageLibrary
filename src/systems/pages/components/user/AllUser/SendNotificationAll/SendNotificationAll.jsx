import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import Swal from "sweetalert2";
import { HandleApi } from "../../../../../../services/handleApi";
import { sendNotifyAllService } from "../../../../../../services/userService";

export default function SendNotificationAll({ data, contentNotify }) {
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const email = data.map((item) => {
            return item.email;
        });
        setUsers(email);
        setSent(false);
    }, [data]);

    const handleValidate = () => {
        let isValid = true;
        if (!contentNotify) {
            Swal.fire({
                icon: "warning",
                title: "Bạn vui lòng tạo thông báo trước khi gửi đến người dùng",
            });
            isValid = false;
        }
        return isValid;
    };

    const handleSendAgain = async () => {
        const sendAgain = await Swal.fire({
            title: "Thông báo này đã được gửi đến các tài khoản này",
            text: "Bạn có chắc muốn gửi lại hay không ?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (result.isDenied) {
                return false;
            }
        });
        return sendAgain;
    };

    const handleSendNotify = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            return;
        }

        if (sent) {
            const checkSendAgain = await handleSendAgain();
            if (!checkSendAgain) {
                setIsLoading(false);
                return;
            }
        }

        let dataBuider = {
            email: users,
            html: contentNotify,
        };

        try {
            const Res = await HandleApi(sendNotifyAllService, dataBuider);
            if (Res.statusCode >= 200 && Res.statusCode < 400) {
                Swal.fire({
                    icon: "success",
                    title: "Bạn đã gửi thông báo thành công",
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
        setIsLoading(false);
    };

    return (
        <Button
            type="primary"
            className="w-full"
            onClick={handleSendNotify}
            loading={isLoading}
        >
            Send All User
        </Button>
    );
}

SendNotificationAll.propTypes = {
    data: PropTypes.array,
    contentNotify: PropTypes.string,
};
