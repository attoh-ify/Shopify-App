import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./controllers/webhooks.js";
import { startScheduler } from "./utilities/scheduler.js";

const PORT = process.env.PORT || 5000;

const server = express();

//Add middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));


server.use('/', router);


server.listen(PORT, async () => {
    startScheduler();
    console.log(`Server running on Port ${PORT}...`);
});
