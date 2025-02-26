import axios from "axios";
import { useDispatch } from "react-redux";
import { setTokens } from "../redux/features/authSlice"


const useAxios = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();

    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: { "Content-Type": "application/json" }
    })



    axiosInstance.interceptors.request.use(
        (config) => {
            console.log(config);
            const token = localStorage.getItem("accessToken");
            // console.log(token);

            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
                console.log("Token set to the header");
                console.log(config);
            }
            return config;
        },
        (error) => Promise.reject(error)
    )

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            //If AccessToken expires then refreshing the token


            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    console.warn("Access Token expired. Trying to refresh token........");
                    const frontendRefreshToken = localStorage.getItem("refreshToken");
                    // console.log(frontendRefreshToken);
                    if (!frontendRefreshToken) {
                        console.error("NO refersh token found.......");
                        localStorage.clear();
                        return Promise.reject(error);
                    }

                    const { data } = await axiosInstance.post("/refresh-token", {
                        refreshToken: frontendRefreshToken,
                    });
                    // console.log("HERE");
                    // console.log("data:", data);
                    const tokens = data.tokens;
                    console.log("Tokens frontend", tokens);
                    dispatch(setTokens(tokens));
                    // localStorage.clear()
                    // localStorage.setItem("accessToken", data.tokens.accessToken);
                    // localStorage.setItem("refreshToken", data.tokens.refreshToken);

                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error("Refresh token invalid.", err);
                    localStorage.clear();
                    window.href.location = '/login'
                }
            }


            // If user is unauthorized

            if (error.response && error.response.status === 403) {
                console.error("(React) Unauthorized! Redirecting to login");
                localStorage.clear();
                // window.location.href = "/login";
            }

            if (error.response && error.response.status === 500) {
                console.error("Something went wrong", error);
                // slocalStorage.clear();
                // window.location.href = "/login";
            }
        }
    );

    return axiosInstance;
};

export default useAxios;