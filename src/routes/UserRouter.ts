import {Router} from "express";
import {UserController} from "../controller/UserController";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";

export class UserRouter {
	public router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.get("/", UserController.getUsers);
		this.router.post("/", UserController.updateUser);
		this.router.put("/", UserController.createUser);

		this.router.get("/:id", UserController.getUserById);
		this.router.delete("/:id", UserController.deleteUser);
		this.router.post("/:id/password", UserController.updatePassword);
	}
}