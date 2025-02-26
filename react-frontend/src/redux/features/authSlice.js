import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;

            // //set Tokens in the localStorage
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
        },

        // eslint-disable-next-line no-unused-vars
        logout: (state, action) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            //remove Tokens from localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },

        //setting tokens again into the state after backend (/refresh-token) is getting called

        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;

            localStorage.clear();
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
        },

    }
});


//this export is for individual ,ethod export for componenets
export const { login, logout, setTokens } = authSlice.actions;

// this export is all reducers export for the store.js
export default authSlice.reducer;