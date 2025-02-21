import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (action, state) => {
            state.loading = true
        },

        loginSuccess: (action, state) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.loading = false;
        },

        loginFail: (action, state) => {
            state.loading = false;
            state.error = action.payload.error;
        },

        logout: (action, state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null
        },

        setLoading: (action, state) => {
            state.loading = action.payload;
        },

        setError: (action, state) => {
            state.error = action.payload;
        }

    }
});

export const { loginStart, loginSuccess, loginFail, logout, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;