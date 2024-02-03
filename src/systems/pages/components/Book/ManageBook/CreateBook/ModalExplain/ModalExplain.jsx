import { Modal } from "antd";
import React, { useState } from "react";

export default function ModalExplain() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <p
                className="text-base cursor-pointer text-[blue]"
                onClick={showModal}
            >
                (xem tại đây)
            </p>
            <Modal
                title="Danh mục sách ?"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>Danh mục sách</div>
            </Modal>
        </div>
    );
}
