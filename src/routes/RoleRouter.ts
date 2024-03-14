import {Router} from "express";
import {RoleController} from "../controller/RoleController";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";

export class RoleRouter {
	public router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.get("/", RoleController.getRoles);
		this.router.post("/", AuthMiddleware.isAdmin, RoleController.updateRole);
		this.router.put("/", AuthMiddleware.isAdmin, RoleController.createRole);

		this.router.get("/:id", RoleController.getRoleById);
		this.router.delete("/:id", AuthMiddleware.isAdmin, RoleController.deleteRole);
	}
}