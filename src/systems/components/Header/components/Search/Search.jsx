import { Button, Modal } from "antd";
import Search from "antd/es/input/Search";
import { useDebounce } from "../../../../../hook/useDebounce";
import { useState } from "react";

export default function SearchBook() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [textSearch, setTextSearch] = useState("");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const debounceValue = useDebounce(textSearch, 700);

    return (
        <div className="">
            <Button
                icon={<i className="bi bi-search"></i>}
                style={{ height: "20px", width: "20px" }}
                onClick={showModal}
                className="h-[20px] w-[20px] flex items-center border-0"
            >
                <span className="flex items-center text-[12px]">
                    Tìm kiếm sách
                </span>
            </Button>

            <Modal
                title="Basic Modal"
                footer={
                    <p style={{ textAlign: "center" }}>
                        Fstack - Học lập trình để đi làm
                    </p>
                }
                open={isModalOpen}
                onCancel={handleCancel}
            >
                <Search
                    value={textSearch}
                    placeholder="Tìm kiếm sách ....."
                    allowClear
                    enterButton="Search"
                    onChange={(e) => setTextSearch(e.target.value)}
                />
            </Modal>
        </div>
    );
}
