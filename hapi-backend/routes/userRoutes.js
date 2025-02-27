import { dashBoardHandler } from "../controllers/userController.js"



export const initUserRoutes = (server) => {

    server.route({
        method: 'GET',
        path: '/dashboard',
        handler: dashBoardHandler
    })
}