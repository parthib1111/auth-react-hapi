import { getUserDashboard } from "../services/userService.js";


export const dashBoardHandler = async (request, h) => {
    const authHeader = request.headers['authorization'];

    if (!authHeader) return h.response({ message: "Token not found!!!" }).code(401);

    const token = authHeader.split(' ')[1];

    const response = await getUserDashboard(token);

    if (response) return h.response(response).code(200);

    return h.response({ messgae: "Access Token invalid or expired!!!" }).code(401);
}