import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwtUtils.js";


const prisma = new PrismaClient();

const refreshSecret = process.env.JWT_REFRESH_SECRET;

export const registerUser = async (name, email, password) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("User already exists");
    }

    await prisma.user.create({ data: { name, email, password } });
    return "User registered successfully!!!!";
};



export const loginUser = async (email, passowrd) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== passowrd) {
        return { message: "Invalid credentials" };
    }

    const tokens = generateToken(user);

    //storing/updating the refreshToken into the db
    const dbRefreshToken = await prisma.token.findUnique({ where: { userId: user.id } })
    if (!dbRefreshToken) {
        await prisma.token.create({
            data: {
                userId: user.id,
                refreshToken: tokens.refreshToken,
            }
        });
    }
    else {
        await prisma.token.update({
            data: {
                refreshToken: tokens.refreshToken
            },
            where: { userId: user.id }
        })
    }
    return { tokens, message: "Login successful in server side!!!" }
}


export const updaterefreshToken = async (refreshToken) => {

    // console.log(refreshToken);
    const decodedToken = jwt.verify(refreshToken, refreshSecret);
    // console.log(decodedToken);
    if (!decodedToken?.id) {
        return { message: "Invalid refresh token from the frontend!!!", tokens: null }
    }

    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

    const tokens = generateToken(user);
    // console.log(tokens);

    await prisma.token.update({
        data: {
            refreshToken: tokens.refreshToken
        },
        where: { userId: user.id }
    })

    return { message: "Tokens updated successfully", tokens: tokens };
}