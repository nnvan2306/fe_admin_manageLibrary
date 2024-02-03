/* eslint-disable react/prop-types */
import { Button, Col, Row } from "antd";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { HandleApi } from "../../../../../../services/handleApi";
import { sendNotifyAllService } from "../../../../../../services/userService";

export default function UserSearch({ user, content }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleValidate = () => {
        let isValid = true;
        if (!content) {
            isValid = false;
        }
        return isValid;
    };

    const handleSendUserSearch = async () => {
        setIsLoading(true);
        const check = handleValidate();
        if (!check) {
            setIsLoading(false);
            Swal.fire({
                icon: "warning",
                title: "Bạn vui lòng nhập thông tin thông báo trước khi gửi",
            });
            return;
        }

        let dataBuider = {
            html: content,
            email: user,
        };
        try {
            const Res = await HandleApi(sendNotifyAllService, dataBuider);
            if (Res.statusCode >= 200 && Res.statusCode < 400) {
                Swal.fire({
                    icon: "success",
                    title: "Bạn đã gửi thông báo thành công",
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lõi vui lòng thử lại sau !",
            });
        }
        setIsLoading(false);
    };

    return (
        <Row className="border my-[5px] p-[10px]">
            <Col span={16}>{user}</Col>
            <Col span={8}>
                <Button
                    type="primary"
                    loading={isLoading}
                    onClick={handleSendUserSearch}
                    className="bg-[#bdbdbd]"
                >
                    Gửi thông báo
                </Button>
            </Col>
        </Row>
    );
}
