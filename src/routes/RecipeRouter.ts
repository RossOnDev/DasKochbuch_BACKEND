import {Router} from "express";
import {RecipeController} from "../controller/RecipeController";
import {AuthMiddleware} from "@middlewares/AuthMiddleware";

export class RecipeRouter {
	public router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.get("/", RecipeController.getRecipes);
		this.router.post("/", AuthMiddleware.isAdmin, RecipeController.updateRecipe);
		this.router.put("/", AuthMiddleware.isAdmin, RecipeController.createRecipe);

		this.router.get("/:id", RecipeController.getRecipeById);
		this.router.delete("/:id", AuthMiddleware.isAdmin, RecipeController.deleteRecipe);
	}
}