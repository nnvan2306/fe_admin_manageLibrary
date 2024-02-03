/* eslint-disable react/prop-types */
import { Button, Modal } from "antd";
import React, { useState } from "react";

export default function ModalInfoUser({ dataUser }) {
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
        <>
            <Button type="primary" onClick={showModal}>
                Info User
            </Button>
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>id: {dataUser.id}</p>
                <p>email: {dataUser.email}</p>
                <p>first name: {dataUser.firstName}</p>
                <p>last name : {dataUser.lastName}</p>
            </Modal>
        </>
    );
}
