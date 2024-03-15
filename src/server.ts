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
import * as http from "http";
import * as https from "https";


dotenv.config();

const app: Application = express();
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;

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

// HTTP REDIRECT
const httpRedirectApp = express();
httpRedirectApp.use((req, res) => {
	res.redirect('https://' + req.hostname + req.originalUrl);
});




// Start Server
if (process.env.MODE === "DEV") {
	app.listen(httpPort, () => {
		console.log(`✨  Started HTTPS Server listening on http://localhost:${httpPort}/`);
	})
}
else {
	const httpServer = http.createServer(httpRedirectApp);
	const httpsServer = https.createServer({}, app);

	httpServer.listen(httpPort, () => {
		console.log(`✨  Started HTTP Server listening on http://localhost:${httpPort}/`);
	});
	httpsServer.listen(httpsPort, () => {
		console.log(`✨  Started HTTPS Server listening on https://localhost:${httpsPort}/`);
	})
}

