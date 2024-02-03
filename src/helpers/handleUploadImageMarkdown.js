import Swal from "sweetalert2";
import handleValidateImage from "./validateImageFile";
import { uploadImage } from "../services/uploadService";
import { HttpStatusCode } from "axios";
import { BASE_URL } from "../utils/constant";

export default async function handleUploadImageMarkdown(file) {
    if (handleValidateImage(file)) {
        const res = await uploadImage({
            image: file,
        });
        if (res.statusCode === HttpStatusCode.Ok) {
            return `${BASE_URL}/upload/folder/app/${res.data.filename}/upload`.replace(
                / /g,
                "%20"
            );
        } else {
            Swal.fire("Ohh", "Vui lòng chọn file ảnh!", "info");
            return null;
        }
    } else {
        Swal.fire("Ohh", "Vui lòng chọn file ảnh!", "info");
    }
}
