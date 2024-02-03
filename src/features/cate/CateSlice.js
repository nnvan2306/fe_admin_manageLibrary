import { createSlice } from "@reduxjs/toolkit";

const initState = {
    data: [],
};

export const cateSlice = createSlice({
    initialState: initState,
    name: "cateSlice",
    reducers: {
        addData(state, action) {
            const stateClone = { ...state };
            stateClone.data = action.payload;
            return stateClone;
        },
        updateData(state, action) {
            state.data = state.data.map((item) => {
                if (item.id === action.payload.id) {
                    item.title = action.payload.title;
                    item.description = action.payload.description;
                    item.description_markdown =
                        action.payload.description_markdown;
                    item.is_active = action.payload.is_active;
                }

                return item;
            });
        },
    },
});

// Action creators are generated for each case reducer function
export const { addData, updateData } = cateSlice.actions;

export default cateSlice.reducer;
