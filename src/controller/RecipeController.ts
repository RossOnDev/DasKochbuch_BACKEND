import {NextFunction, Request, Response} from "express";
import {Recipe} from "@models/Recipe";
import {RecipeRepository} from "@repositories/RecipeRepository";
import {StatusCodes} from "http-status-codes";
import {RecipeDto} from "@models/Dto/RecipeDto";

export class RecipeController {
	private static readonly RECIPE_REPOSITORY = new RecipeRepository();

	public static async getRecipes(req: Request, res: Response, next: NextFunction) {
		try {
			const withDeleted = !!req.query.withDeleted;
			const title = req.query.title as string | null;

			const recipes: Recipe[] = !title ?
				await RecipeController.RECIPE_REPOSITORY.getRecipes(withDeleted) :
				await RecipeController.RECIPE_REPOSITORY.getRecipesByTitle(title, withDeleted);
			res.json(recipes.map(recipe => recipe.toDto()));
		} catch (error: any) {
			next(error);
		}
	}

	public static async getRecipeById(req: Request, res: Response, next: NextFunction) {
		try {
			const withDeleted = !!req.query.withDeleted;
			const recipe = await RecipeController.RECIPE_REPOSITORY.getRecipeById(Number(req.params.id), withDeleted);
			if (recipe) {
				res.json(recipe.toDto())
			}
			else {
				res.sendStatus(StatusCodes.NOT_FOUND);
			}
		} catch (error: any) {
			next(error);
		}
	}

	public static async createRecipe(req: Request, res: Response, next: NextFunction) {
		try {
			const recipeDto: RecipeDto = req.body;
			const recipe = await Recipe.fromDto(recipeDto);
			await RecipeController.RECIPE_REPOSITORY.createRecipe(recipe);

			res.sendStatus(StatusCodes.CREATED);
		} catch (error: any) {
			next(error);
		}
	}

	public static async updateRecipe(req: Request, res: Response, next: NextFunction) {
		try {
			const recipeDto: RecipeDto = req.body;
			const recipe = await Recipe.fromDto(recipeDto);
			await RecipeController.RECIPE_REPOSITORY.updateRecipe(recipe);

			res.sendStatus(StatusCodes.OK);
		} catch (error: any) {
			next(error);
		}
	}

	public static async deleteRecipe(req: Request, res: Response, next: NextFunction) {
		try {
			const recipeId = Number(req.params.id);
			await RecipeController.RECIPE_REPOSITORY.deleteRecipe(recipeId);

			res.sendStatus(StatusCodes.OK)

		} catch (error: any) {
			next(error);
		}
	}
}