import { toast } from "react-toastify";

export default function handleToastPromise({
    variableLoading,
    isLoading = true,
    text = "",
    type = "success",
}) {
    toast.update(variableLoading, {
        render: text,
        type: type,
        isLoading: isLoading,
        closeOnClick: true,
        autoClose: 2000,
    });
}

// export function handleToast({
// variableLoading,
//     isLoading = true,
//     text = "",
//     type = "success",
// }) {
//     toast.update(variableLoading, {
//         position: "top-center",
//         render: text,
//         type: type,
//         isLoading: isLoading,
//         closeOnClick: true,
//         autoClose: 2000,
//     });
// }
