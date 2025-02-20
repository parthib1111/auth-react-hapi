import Hapi from "@hapi/hapi";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const generateToken = (user) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email }, accessSecret, { expiresIn: "1m" });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, refreshSecret, { expiresIn: "7d" });
    return { accessToken, refreshToken };

}

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Content-Type', 'Authorization']
            }
        }
    });


    //Register route
    server.route({
        method: 'POST',
        path: '/register',
        handler: async (request, h) => {
            try {
                // console.log(request.payload);
                const { email, password } = request.payload;
                // console.log(email);
                // console.log(password);

                const existingUser = await prisma.user.findUnique({ where: { email } });
                // console.log("Parthib", existingUser);
                if (existingUser) {
                    return h.response({ message: 'User already exist' }).code(400);
                }


                await prisma.user.create({
                    data: {
                        email: email,
                        password: password
                    }
                });
                return h.response({ message: 'User registered successfully!!!' }).code(201);
            } catch (error) {
                return h.response({ messgae: "User Registration failed in server side!!!" }).code(500);
            }
        }
    })

    //Login route
    server.route({
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            try {
                const { email, password } = request.payload;
                // console.log(email);
                // console.log(password);
                const user = await prisma.user.findUnique({ where: { email } });
                // console.log(user);
                if (!user) {
                    return h.response({ message: "Login Failed!! Invalid credentials" }).code(400);
                }

                if (user.password !== password) {
                    return h.response({ message: "Login Failed!!!Password missmatch" }).code(400);
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


                return h.response({
                    message: "Login successful",
                    tokens: tokens
                }).code(200);
            } catch (error) {
                console.log(error);
                return h.response({
                    messgae: "User Login failed in server side!!!"
                }).code(500);
            }
        }
    })


    //Protected Route 

    server.route({
        method: 'GET',
        path: '/dashboard',
        handler: async (request, h) => {
            const authHeader = request.headers['authorization'];
            if (!authHeader) h.response({ messgae: "Token not found in server side!!!" }).code(401);
            // console.log(authHeader);
            const token = authHeader.split(' ')[1];


            try {
                const decodedToken = jwt.verify(token, accessSecret);
                const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
                // console.log(user);

                if (!user) return h.response({ message: "User not found in the server side!!!" }).code(401);

                return h.response({
                    message: "Welcome to the dashboard!!!",
                    user: user
                }).code(200);
            } catch (error) {
                return h.response({ message: "Accesstoken expired or invalid!!!" }).code(401);
            }
        }
    });


    //refresh-token api
    server.route({
        method: 'POST',
        path: '/refresh-token',
        handler: async (request, h) => {
            try {
                const { refreshToken } = request.payload;
                // console.log("FrontToken::", refreshToken);

                if (!refreshToken) {
                    return h.response({ message: "RefreshToken not found in clientside" }).code(401);
                }

                const decoded = jwt.verify(refreshToken, refreshSecret);

                if (!decoded?.id) {
                    return h.response({ message: "Invalid refresh token from the frontend" }).code(403);
                }

                const dbRefreshToken = await prisma.token.findUnique({ where: { userId: decoded.id } });
                // console.log(dbRefreshToken);

                const user = await prisma.user.findUnique({
                    select: { id: true, email: true },
                    where: { id: decoded.id }
                });

                // console.log(user);

                const tokens = generateToken(user);

                await prisma.token.update({
                    data: {
                        refreshToken: tokens.refreshToken
                    },
                    where: { userId: user.id }
                })

                return h.response({
                    message: "refreshToken updated successfully!!!",
                    tokens: tokens
                }).code(200);
            } catch (error) {
                console.error(error);
                return h.response({ message: "refreshToken update failed!!!!" }).code(401);
            }

        }
    })

    await server.start();
    console.log('Server is running on: ', server.info.uri);
}

init();