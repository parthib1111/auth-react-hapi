import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export const generateToken = (user) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email }, accessSecret, { expiresIn: "1m" });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, refreshSecret, { expiresIn: "7d" });
    return { accessToken, refreshToken };

}