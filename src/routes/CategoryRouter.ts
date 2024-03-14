import {Router} from "express";
import {CategoryController} from "../controller/CategoryController";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";

export class CategoryRouter {
	public router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.get("/", CategoryController.getCategories);
		this.router.post("/", AuthMiddleware.isAdmin, CategoryController.updateCategory);
		this.router.put("/", AuthMiddleware.isAdmin, CategoryController.createCategory);

		this.router.get("/:id", CategoryController.getCategoryById);
		this.router.delete("/:id", AuthMiddleware.isAdmin, CategoryController.deleteCategory);
	}
}