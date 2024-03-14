import process from "process";
import express, {Application, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cors from "cors";
import status from "express-status-monitor"
import {initDataSource} from "./DbConnection";
import dotenv from "dotenv";
import {RouterManager} from "@routes/RouterManager";
import cookieParser from "cookie-parser";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: process.env.JSON_LIMIT}));
app.use(methodOverride())
app.use(cookieParser())
app.use(cors({
	origin: /localhost/,
	credentials: true
}));
app.use(status());

app.use("/files", AuthMiddleware.isLoggedIn, express.static('files'))
app.use(express.static('public'))

initDataSource();

const routerManager = new RouterManager();
app.use("/api", routerManager.router);
app.use(routerManager.defaultFallback);


// Start Server
app.listen(port, () => {
	console.log(`✨  Starting API listening on http://localhost:${port}/`);
})