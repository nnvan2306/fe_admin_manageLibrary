import { createSlice } from "@reduxjs/toolkit";

const initState = {
    isLoginIn: false,
    user: null,
    role: null,
};

export const authSlice = createSlice({
    initialState: initState,
    name: "authSlice",
    reducers: {
        loginSuccess(state, action) {
            const stateClone = {
                ...state,
            };
            stateClone.user = action.payload.user;
            stateClone.isLoginIn = true;
            stateClone.role = action.payload.user.role;
            return stateClone;
        },

        logoutAction(state) {
            // state._token_device = null;
            state.isLoginIn = false;
            state.user = null;
            state.user = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const { loginSuccess, logoutAction } = authSlice.actions;

export default authSlice.reducer;
