export const columns = [
    {
        title: "ID",
        dataIndex: "id",
        width: 50,
    },
    {
        title: "first name",
        dataIndex: "fistName",
        width: "auto",
    },
    {
        title: "last name",
        dataIndex: "lastName",
        width: "auto",
    },
    {
        title: "email",
        dataIndex: "email",
        width: "auto",
    },
    {
        title: "Xác thực Email",
        dataIndex: "is_verify_email",
        width: "auto",
        render(boolen) {
            return boolen ? "Đã xác minh" : "chua Xác minh";
        },
    },
    {
        title: "vai trò",
        dataIndex: "role",
        width: "auto",
    },

    {
        title: "Hành Động",
        dataIndex: "action",
        width: "auto",
    },
];
