import { loginUser, registerUser, updaterefreshToken } from "../services/authService.js";


export const registerHandler = async (request, h) => {
    try {
        const { name, email, password } = request.payload;
        const message = await registerUser(name, email, password);
        return h.response({ message }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ message: "User registration failed in server side!!!" }).code(500);
    }
}

export const loginHandler = async (request, h) => {
    try {
        const { email, password } = request.payload;
        const { tokens, message } = await loginUser(email, password);
        return h.response({
            tokens: tokens,
            message: message
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            messgae: "User Login failed in server side!!!"
        }).code(500);
    }
}

export const refreshTokenHandler = async (request, h) => {
    try {
        const { refreshToken } = request.payload;
        const { message, tokens } = await updaterefreshToken(refreshToken);
        // console.log(tokens);
        if (tokens) {
            return h.response({ message, tokens }).code(200);
        }
        return h.response({ message }).code(401);
    } catch (error) {
        console.error(error);
        return h.response({ message: "refersh token updation failed in server side!!!" }).code(401);
    }
}