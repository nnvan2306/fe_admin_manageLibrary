import { Modal } from "antd";
import React, { useState } from "react";

export default function ModalShowContent() {
    const [isModalContentOpen, setIsModalContentOpen] = useState(false);
    const showModalContent = () => {
        setIsModalContentOpen(true);
    };
    const handleOkContent = () => {
        setIsModalContentOpen(false);
    };
    const handleCancelContent = () => {
        setIsModalContentOpen(false);
    };
    return (
        <div className="absolute z-2 h-full w-full" onClick={showModalContent}>
            content
            <Modal
                width={1000}
                title="Basic Modal"
                open={isModalContentOpen}
                onOk={handleOkContent}
                onCancel={handleCancelContent}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    );
}
