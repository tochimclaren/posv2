import { Server } from 'http';
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import compression from 'compression';
import RootRouter from "./src/routers/index"
import { notFoundError } from "./src/middlewares/middleware.404"


require("dotenv").config()
const PORT = process.env.PORT || 4000
import db from './models';
export const app = express();
app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression());
app.use(RootRouter)
app.use(notFoundError)


let server: Server;

export const startServer = async (): Promise<Server> => {
    await db.sequelize.sync();
    server = app.listen(PORT, () => {
        if (process.env.NODE_ENV !== 'test') {
            console.log(`server is running on port: ${PORT}`);
        }
    });
    return server;
};

export const stopServer = async (): Promise<void> => {
    if (server) {
        await db.sequelize.close();
        await new Promise<void>((resolve, reject) => {
            server.close((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}