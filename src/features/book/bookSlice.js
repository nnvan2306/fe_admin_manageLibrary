import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/constant";

const initState = {
    srcImages: [],
};

export const bookSlice = createSlice({
    initialState: initState,
    name: "bookSlice",
    reducers: {
        srcImageByLink(state, action) {
            const stateClone = { ...state };
            const arrLink = action.payload.map((item) => {
                return `${BASE_URL}/upload/folder/app/${item.link_url}/book`;
            });
            stateClone.srcImages = [...arrLink];
            return stateClone;
        },
        srcImageByFile(state, action) {
            const stateClone = { ...state };
            const arrLink = action.payload.map((item) => {
                return URL.createObjectURL(item);
            });
            stateClone.srcImages = [...stateClone.srcImages, ...arrLink];
            return stateClone;
        },
    },
});

// Action creators are generated for each case reducer function
export const { srcImageByLink, srcImageByFile } = bookSlice.actions;

export default bookSlice.reducer;
