import { loginHandler, refreshTokenHandler, registerHandler } from "../controllers/authController.js";


export const initAuthRoutes = (server) => {

    server.route({
        method: 'POST',
        path: '/register',
        handler: registerHandler
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: loginHandler
    })

    server.route({
        method: 'POST',
        path: '/refresh-token',
        handler: refreshTokenHandler
    })
}