import {AppDataSource} from "../DbConnection";
import {Recipe} from "@models/Recipe";
import {Category} from "@models/Category";

export class RecipeRepository {
	private repository = AppDataSource.getRepository(Recipe);

	constructor() {
	}

	public async getRecipes(withDeleted: boolean = false) {
		try {
			return await this.repository.find({
				relations: ["role", "category", "imageCover"],
				withDeleted: withDeleted
			});
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getRecipesByTitle(title: string, withDeleted = false) {
		try {
			return await this.repository.find({
				relations: ["role", "category", "imageCover"],
				withDeleted: withDeleted,
				where: {
					title: title
				}
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async getRecipeById(id: number, withDeleted: boolean = false) {
		try {
			return await this.repository.findOne({
				where: {
					id: id
				},
				relations: ["role", "category", "imageCover"],
				withDeleted: withDeleted
			})
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async createRecipe(recipe: Recipe) {
		const dbRecipe = await this.getRecipeById(recipe.id);
		if (dbRecipe) throw "Duplicate entry";

		try {
			const entityRecipe = this.repository.create(recipe);
			await this.repository.save(entityRecipe);

			return entityRecipe;
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async updateRecipe(recipe: Recipe) {
		try {
			return this.repository.save(recipe);
		} catch (error: any) {
			throw error.toString();
		}
	}

	public async deleteRecipe(recipeId: number) {
		try {
			return await this.repository.softDelete(recipeId);
		} catch (error: any) {
			throw error.toString();
		}
	}
}