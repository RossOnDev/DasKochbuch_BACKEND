import {Router} from "express";
import {AuthController} from "../controller/AuthController";

export class AuthRouter {
	public router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.post("/login", AuthController.getUserByLogin);
		this.router.post("/validate", AuthController.isTokenValid);
	}
}