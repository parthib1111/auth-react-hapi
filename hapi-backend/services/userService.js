import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();
const accessSecret = process.env.JWT_ACCESS_SECRET;

export const getUserDashboard = async (token) => {
    try {
        const decodedToken = jwt.verify(token, accessSecret);
        const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
        if (!user) {
            return null;
        }
        return { message: "Welcome to the dashboard from server side!!!", user };
    } catch (error) {
        // console.log("Error in userService server side!!!", error);
        return null;
    }
}